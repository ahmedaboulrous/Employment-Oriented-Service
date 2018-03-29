const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use('/api/search', require('../../controllers/search'));


describe('Search HTTP REST API Routes', () => {
    before((done) => {
        app.use(bodyParser.json());
        app.use('/api/search', require('../../controllers/search'));
        server = app.listen(process.env.PORT || 3000, () => {
            console.log('>> Now listening for Requests');
        });
        setTimeout(() => { done(); }, 1500);
    });

    after((done) => {
        server.close();
        done();
    });

    it('should pass if there is data in the DB', (done) => {
        request(app)
            .get('/api/search')
            .query('q=*:*')
            .expect(200, done);
    });
});
