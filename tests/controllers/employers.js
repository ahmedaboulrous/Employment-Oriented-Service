const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
let server;

let EmpRev;

describe('Employers HTTP REST API Routes', () => {
    before((done) => {
        app.use(bodyParser.json());
        app.use('/api/employers', require('../../controllers/employers'));
        server = app.listen(process.env.PORT || 3000, () => {
            console.log('>> Now listening for Requests');
        });
        setTimeout(() => { done(); }, 1500);
    });

    after((done) => {
        server.close();
        done();
    });

    it('POST /api/employers', (done) => {
        request(app)
            .post('/api/employers')
            .send({
                 _id: 'test',
                 Name: 'tester',
                 Email: 'tester@ibm.com',
                 Password: 'test123',
                 Organization: 'FEE'
            })
            .expect(200)
            .end((err, res) => {
                if (!err) {
                    EmpRev = res.body.rev;
                    done();
                }
                else {
                    done(err);
                }
            });
    });

    it('GET /api/employers', (done) => {
      request(app)
        .get('/api/employers')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it('GET /api/employers/test', (done) => {
        request(app)
          .get('/api/employers/test')
          .set('Accept', 'application/json')
          .expect(200, done);
    });

    it('PUT /api/employers', (done) => {
        request(app)
          .put('/api/employers')
          .send({
             _id: 'test',
             _rev: EmpRev,
             Name: 'updatedTester',
             Email: 'tester@ibm.com',
             Password: 'test123',
             Organization: 'IBM'
        })
        .expect(200)
        .end((err, res) => {
            if (!err) {
                EmpRev = res.body.rev;
                done();
            }
            else {
                done(err);
            }
        });
    });

    it('DELETE /api/employers', (done) => {
        request(app)
          .delete('/api/employers')
          .send({
            _id: 'test',
            _rev: EmpRev,
        })
        .expect(200, done);
    });
});
