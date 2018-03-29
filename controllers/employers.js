const express = require('express');

const router = express.Router();
const employerModel = require('../models/employer');


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
	if (inputJSON.Organization === undefined)
		{ return false; }

	return true;
}


// Reading a list of Employers
router.get('/', (req, res) => {
	employerModel.readAllEmployers((err, employersList) => {
		if (!err) {
			res.status(200).send(employersList);
		}
		else {
			res.status(400).send({ Error: err });
		}
	});
});

// Reading a specific Employer Data Requires: only the _id 
router.get('/:id', (req, res) => {
	employerModel.readEmployerById(req.params.id, (err, employerData) => {
		if (!err) {
			res.status(200).send(employerData);
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
		employerModel.createNewEmployer(req.body, (err, createdEmployer) => {
			if (!err) {
				res.status(200).send(createdEmployer);
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
		employerModel.updateEmployerDoc(req.body, (err, updatedEmployer) => {
			if (!err) {
				res.status(200).send(updatedEmployer);
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
	employerModel.deleteEmployerDoc(req.body, (err, deletedEmployer) => {
		if (!err) {
			res.status(200).send(deletedEmployer);
		}
		else {
			res.status(400).send({ Error: err });
		}
	});
});


module.exports = router;

