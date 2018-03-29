const fs = require('fs');


let employersDB;
let cloudant;
const dbCredentials = {
	dbName: 'employers',
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
		// url will be in this format: 
		// https://username:password@xxxxxxxxx-bluemix.cloudant.com
		dbCredentials.url = getDBCredentialsUrl(
			fs.readFileSync('vcap-local.json', 'utf-8'));
	}

	cloudant = require('cloudant')(dbCredentials.url);

	// check if DB exists if not create
	cloudant.db.create(dbCredentials.dbName, (err, res) => {
		if (err) {
			console.log('Could not create new db: '
						+ dbCredentials.dbName + ', it might already exist.');
		}
	});

	employersDB = cloudant.use(dbCredentials.dbName);
}

initDBConnection();

//===========================================================================================


// Create
exports.createNewEmployer = function (newEmployer, callBack) {
	employersDB.insert(newEmployer, (err, body) => {
		if (!err)
			{ callBack(null, body); }
		else
			{ callBack(err, null); }
	});
};


// Read
exports.readAllEmployers = function (callBack) {
	employersDB.list({ include_docs: true }, (err, body) => {
		if (!err)
			{ callBack(null, body); }
		else
			{ callBack(err, null); }
	});
};
exports.readEmployerById = function (id, callBack) {
	employersDB.get(id, (err, body) => {
		if (!err)
			{ callBack(null, body); }
		else
			{ callBack(err, null); }
	});
};


// Update
exports.updateEmployerDoc = function (updatedEmployer, callBack) {
	employersDB.insert(updatedEmployer, (err, body) => {
		if (!err)
			{ callBack(null, body); }
		else
			{ callBack(err, null); }
	});
};

// Delete
exports.deleteEmployerDoc = function (doc, callBack) {
	employersDB.destroy(doc._id, doc._rev, (err, body) => {
		if (!err)
			{ callBack(null, body); }
		else
			{ callBack(err, null); }
	});
};
