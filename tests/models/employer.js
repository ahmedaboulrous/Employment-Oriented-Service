const mocha = require('mocha');
const assert = require('assert');

let Employer;
let EmpId;
let EmpRev;

describe('Employers Model Testing', () => {
    before((done) => {
        Employer = require('../../models/employer');
        setTimeout(() => { done(); }, 1000);
    });

    it('Should Create a new Employer', (done) => {
        let assertedEmployer = {
            Name: 'test employer',
            Email: 'emp_test@ibm.com',
            Password: 'i am alive',
            Organization: 'ibm',
            Wish_List: ['id1', 'id2', 'id3'],
            Worked_With: ['id4', 'id5', 'id6'],
            Working_With: ['id7', 'id8', 'id9'],
        };

        Employer.createNewEmployer(assertedEmployer, (err, createdEmployer) => {
			if (err) {
                done(err);
            }
            else {
                EmpId = createdEmployer.id;
                EmpRev = createdEmployer.rev;
                done();
            }
        });
    });

    it('Should Read all Employers', (done) => {
        Employer.readAllEmployers((err, list) => {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
    });

    it('Should Read an Employer by ID', (done) => {
        Employer.readEmployerById(EmpId, (err, result) => {
            if (err) {
                done(err);
            }
            else {
                EmpId = result._id;
                EmpRev = result._rev;
                done();
            }
        });
    });

    it('Should Update a new Employer', (done) => {
        let updatedEmployer = {
            _id: EmpId,
            _rev: EmpRev,
            Name: 'test updated',
            Email: 'emp_test@ibm.com',
            Password: 'i am updated',
            Organization: 'ibm'
        };

        Employer.updateEmployerDoc(updatedEmployer, (err, result) => {
            if (err) {
                done(err);
            }
            else {
                EmpId = result.id;
                EmpRev = result.rev;
                done();
            }
        });
    });

    it('Should Delete the Created Employer', (done) => {
        const toBeDeletedEmployer = {
            _id: EmpId,
            _rev: EmpRev
        };

        Employer.deleteEmployerDoc(toBeDeletedEmployer, (err, result) => {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
    });
});
