const fs = require('fs');

let usersDB;
let cloudant;
const dbCredentials = {
	dbName: 'users',
};

function getDBCredentialsUrl(jsonData) {
	const vcapServices = JSON.parse(jsonData);
	// Pattern match to find the first instance of a Cloudant service in
	// VCAP_SERVICES. If you know your service key, you can access the
	// service credentials directly by using the vcapServices object.
	for (const vcapService in vcapServices) {
		if (vcapService.match(/cloudant/i)) {
			return vcapServices[vcapService][0].credentials.url;
		}
	}
}

function initDBConnection() {
	// When running on Bluemix, this variable will be set to a json object
	// containing all the service credentials of all the bound services
	if (process.env.VCAP_SERVICES) {
		dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
	} else { // When running locally, the VCAP_SERVICES will not be set
		// When running this app locally you can get your Cloudant credentials
		// from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
		// Variables section for an app in the Bluemix console dashboard).
		// Once you have the credentials, paste them into a file called vcap-local.json.
		// Alternately you could point to a local database here instead of a
		// Bluemix service.
		// url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
		dbCredentials.url = getDBCredentialsUrl(fs.readFileSync('vcap-local.json', 'utf-8'));
	}

	cloudant = require('cloudant')(dbCredentials.url);

	// check if DB exists if not create
	cloudant.db.create(dbCredentials.dbName, (err, res) => {
		if (err) {
			console.log('Could not create new db: '
						+ dbCredentials.dbName + ', it might already exist.');
		}
	});

	usersDB = cloudant.use(dbCredentials.dbName);
}

function initIndexes() {
	const user_indexer = function (doc) {
		if (doc.Name) {
			index('Name', doc.Name, { store: true });
		}
		if (doc.Email) {
			index('Email', doc.Email, { store: true });
		}
		if (doc.Phone) {
			index('Phone', doc.Phone, { store: true });
		}
		if (doc.Skills) {
			for (var i in doc.Skills) {
				index('Skill', doc.Skills[i], { store: true, facet: true });
			}
		}
	};

	const ddoc = {
		_id: '_design/users',
		indexes: {
			searchAll: {
				analyzer: { name: 'standard' },
				index: user_indexer,
			},
		},
	};

	usersDB.insert(ddoc, (err, result) => {
		if (err) {
			console.log('Could not create new users Search Design: it might already exist.');
		}
	});
}

initDBConnection();
setTimeout(() => { initIndexes(); }, 1000);


// Create
exports.createNewUser = function (newUser, callBack) {
	usersDB.insert(newUser, (err, body) => {
		if (!err) {
			callBack(null, body);
		}
		else {
			callBack(err, null);
		}
	});
};


// Read
exports.readAllUsers = function (callBack) {
	usersDB.list({ include_docs: true }, (err, body) => {
		if (!err) {
			callBack(null, body);
		}
		else {
			callBack(err, null);
		}
	});
};
exports.readUserById = function (id, callBack) {
	usersDB.get(id, (err, body) => {
		if (!err) {
			callBack(null, body);
		}
		else {
			callBack(err, null);
		}
	});
};


// Update
exports.updateUserDoc = function (updatedUser, callBack) {
	usersDB.insert(updatedUser, (err, body) => {
		if (!err) {
			callBack(null, body);
		}
		else {
			callBack(err, null);
		}
	});
};

// Delete
exports.deleteUserDoc = function (doc, callBack) {
	usersDB.destroy(doc._id, doc._rev, (err, body) => {
		if (!err) {
			callBack(null, body);
		}
		else {
			callBack(err, null);
		}
	});
};


//= =======================


exports.searchQuery = function (query, callBack) {
	usersDB.search('users', 'searchAll', query, (err, result) => {
		if (!err) {
			callBack(null, result);
		}
		else {
			callBack(err, null);
		}
	});
};
