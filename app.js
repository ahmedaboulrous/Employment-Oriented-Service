const express = require('express');
const bodyParser = require('body-parser');


// setup express app
const app = express();
// setup view Engine
app.engine('html', require('ejs').renderFile);
// setup public files
app.use(express.static(__dirname + '/public'));
// transform all comming requests into json format
app.use(bodyParser.json());


// Web App Entry Page
app.get('/', (req, res) => {
	res.render('index.html');
});


// Controllers
app.use('/api/employers', require('./controllers/employers'));
app.use('/api/users', require('./controllers/users'));
app.use('/api/search', require('./controllers/search'));

// Listening
app.listen(process.env.PORT || 3000, () => {
	console.log('>> Now listening for Requests');
});
