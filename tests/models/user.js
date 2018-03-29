const mocha = require('mocha');
const assert = require('assert');

let User;
let UserId;
let UserRev;

describe('Users Model Testing', () => {

    before((done) => {
        User = require('../../models/user');
        setTimeout(() => { done(); }, 1900);
    });

    it('Should Create a new User', (done) => {
        let assertedUser = {
            Name: 'test employer',
            Email: 'emp_test@ibm.com',
            Password: 'i am alive'
        };

        User.createNewUser(assertedUser, (err, createdUser) => {
			if (err) {
                done(err);
            }
            else {
                UserId = createdUser.id;
                UserRev = createdUser.rev;
                done();
            }
        });
    });

    it('Should Read all Users', (done) => {
        User.readAllUsers((err, list) => {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
    });

    it('Should Read a User by ID', (done) => {
        User.readUserById(UserId, (err, result) => {
            if (err) {
                done(err);
            }
            else {
                UserId = result._id;
                UserRev = result._rev;
                done();
            }
        });
    });

    it('Should Update a new User', (done) => {
        let updatedUser = {
            _id: UserId,
            _rev: UserRev,
            Name: 'test updated',
            Email: 'user_test@ibm.com',
            Password: 'i am updated'
        };

        User.updateUserDoc(updatedUser, (err, result) => {
            if (err) {
                done(err);
            }
            else {
                UserId = result.id;
                UserRev = result.rev;
                done();
            }
        });
    });

    it('Should Delete the Created User', (done) => {
        const toBeDeletedEmployer = {
            _id: UserId,
            _rev: UserRev
        };

        User.deleteUserDoc(toBeDeletedEmployer, (err, result) => {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
    });
});
