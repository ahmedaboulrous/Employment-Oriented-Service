const express = require('express');

const router = express.Router();
const userModel = require('../models/user');


// checks the input 
function isValidInput(inputJSON) {
	if (inputJSON === null)
		{ return false; }

	if (inputJSON.Name === undefined)
		{ return false; }
	if (inputJSON.Email === undefined)
		{ return false; }
	if (inputJSON.Password === undefined)
		{ return false; }
	if (inputJSON.Phone === undefined)
		{ return false; }
	if (inputJSON.University === undefined)
		{ return false; }
	if (inputJSON.Faculty === undefined)
		{ return false; }

	return true;
}


// Reading a list of Users
router.get('/', (req, res) => {
	userModel.readAllUsers((err, usersList) => {
		if (!err) {
			res.status(200).send(usersList);
		}
		else {
			res.status(400).send({ Error: err });
		}
	});
});

// Reading a specific User Data Requires: only the _id 
router.get('/:id', (req, res) => {
	userModel.readUserById(req.params.id, (err, userData) => {
		if (!err) {
			res.status(200).send(userData);
		}
		else {
			res.status(400).send({ Error: err });
		}
	});
});

// cloudant is a Schema-Less DB
// front-end developer must make sure that the objects sent
// follow the agreed-upon schema , in a JSON Object format
router.post('/', (req, res) => {
	if (isValidInput(req.body)) {
		userModel.createNewUser(req.body, (err, createdUser) => {
			if (!err) {
				res.status(200).send(createdUser);
			}
			else {
				res.status(400).send({ Error: err });
			}
		});
	}
	else {
		res.status(400).send({ error: 'Non-Valid post-Input Format' });
	}
});

// Updating requires: all the data (_id, _rev, Name, ... ), sent as a JSON object
router.put('/', (req, res) => {
	if (isValidInput(req.body)) {
		userModel.updateUserDoc(req.body, (err, updatedUser) => {
			if (!err) {
				res.status(200).send(updatedUser);
			}
			else {
				res.status(400).send({ Error: err });
			}
		});
	}
	else {
		res.status(400).send({ error: 'Non-Valid put-Input Format' });
	}
});

// Deleting requires: at least _id and _rev , sent as a JSON object
router.delete('/', (req, res) => {
	userModel.deleteUserDoc(req.body, (err, deletedUser) => {
		if (!err) {
			res.status(200).send(deletedUser);
		}
		else {
			res.status(400).send({ Error: err });
		}
	});
});


module.exports = router;
