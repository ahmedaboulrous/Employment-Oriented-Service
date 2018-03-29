const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
let server;

let UserRev;

describe('Users HTTP REST API Routes', () => {
    before((done) => {
        app.use(bodyParser.json());
        app.use('/api/users', require('../../controllers/users'));
        server = app.listen(process.env.PORT || 3000, () => {
            console.log('>> Now listening for Requests');
        });
        setTimeout(() => { done(); }, 1500);
    });

    after((done) => {
        server.close();
        done();
    });

    it('POST /api/users', (done) => {
        request(app)
            .post('/api/users')
            .send({
                 _id: 'test',
                 Name: 'tester',
                 Email: 'tester@ibm.com',
                 Password: 'test123',
                 Phone: '12345',
                 University: 'MNF',
                 Faculty: 'FEE'
            })
            .expect(200)
            .end((err, res) => {
                if (!err) {
                    UserRev = res.body.rev;
                    done();
                }
                else {
                    done(err);
                }
            });
    });

    it('GET /api/users', (done) => {
      request(app)
        .get('/api/users')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it('GET /api/users/test', (done) => {
        request(app)
          .get('/api/users/test')
          .set('Accept', 'application/json')
          .expect(200, done);
    });

    it('PUT /api/users', (done) => {
        request(app)
          .put('/api/users')
          .send({
             _id: 'test',
             _rev: UserRev,
             Name: 'updatedTester',
             Email: 'tester@ibm.com',
             Password: 'test123',
             Phone: '6789',
             University: 'MNF',
             Faculty: 'FEE'
        })
        .expect(200)
        .end((err, res) => {
            if (!err) {
                UserRev = res.body.rev;
                done();
            }
            else {
                done(err);
            }
        });
    });

    it('DELETE /api/users', (done) => {
        request(app)
          .delete('/api/users')
          .send({
            _id: 'test',
            _rev: UserRev,
        })
        .expect(200, done);
    });
});
