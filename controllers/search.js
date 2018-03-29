const express = require('express');

const router = express.Router();
const userModel = require('../models/user');


router.get('/', (req, res) => {
    userModel.searchQuery(req.query, (err, result) => {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(400).send(err);
        }
    });
});


module.exports = router;

/*
    // this syntax matches all documents 
    http://localhost:3000/api/search ? q= *:*

    // search for two fields ( Using AND )
    http://localhost:3000/api/search ? q= Name:"ahmed" AND Phone: "0123456789"

    // search for having multiple skills
    http://localhost:3000/api/search ? q= Skill: "javascript" AND Skill: "java"
    
    important: 
    - Not to forget the q= at the beginning
    - Search for two or more things should be separated by AND
    - key: "value" <= the value should be surounded by double quotes


*/
