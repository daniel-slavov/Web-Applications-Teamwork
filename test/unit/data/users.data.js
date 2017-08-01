const { expect } = require('chai');
const sinon = require('sinon');
const { ObjectID } = require('mongodb');

const UsersData = require('../../../data/users.data');
const User = require('../../../models/user');

describe('UsersData', () => {
    const db = {
        collection: () => { },
    };

    let users = [];
    const isValidUser = (userObj) => {
        return true;
    };
    const validator = {
        isValidUser,
    };
    let data = null;
    const events = [{ title: 'Some event' }];
    const foundUsers = [{
        _id: '596b2a0ae6239d22044adb29',
        username: 'user1',
        password: '234567',
    }];

    const toArray = () => {
        return Promise.resolve(foundUsers);
    };
    const find = (user) => {
        return {
            toArray,
        };
    };

    const insertOne = (user) => {
        users.push(user);
    };

    const foundUser = { username: 'user', password: '123456', events: events };
    let findOne = (username, password) => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username &&
                users[i].password === password) {
                return Promise.resolve(users[i]);
            }
        }

        return {};
    };
    const newEvent = { title: 'New event' };
    let update = (userObj) => {
        users[0].events.push(newEvent);
    };


    beforeEach(() => {
        users = [{
            _id: '596b1d2cfef2e82704d679e4',
            username: 'user',
            password: '123456',
            events: events,
        },
        {
            _id: '596b2a0ae6239d22044adb29',
            username: 'user1',
            password: '234567',
        }];

        sinon.stub(db, 'collection')
            .callsFake(() => {
                return { findOne, find, insertOne, update };
            });
        sinon.stub(validator, 'isValidUser')
            .callsFake(() => {
                return isValidUser;
            });
        data = new UsersData(db, validator);
    });

    afterEach(() => {
        db.collection.restore();
        validator.isValidUser.restore();
    });

    describe('getUserByPattern()', () => {
        it('expect to return users if users were found', () => {
            return data.getUserByPattern('r1')
                .then((found) => {
                    expect(found).to.deep.equal(foundUsers);
                });
        });
        it('expect to return null if users were not found', () => {
            return data.getUserByPattern('te')
                .then((user) => {
                    expect(user).to.deep.equal(foundUsers);
                });
        });
    });

    describe('getUser()', () => {
        before(() => {
            findOne = (user) => {
                for (let us of users) {
                    if (user.username === us.username) {
                        return us;
                    }
                }

                return {};
            };
        });

        it('expect to return user if user was found', () => {
            const found = data.getUser('user');
            expect(found.username).to.deep.equal('user');
        });

        it('expect to return empty object if user was not found', () => {
            const found = data.getUser('test');
            expect(found).to.be.empty;
        });
    });

    describe('getUserById()', () => {
        before(() => {
            findOne = (user) => {
                for (let us of users) {
                    if (user._id.toString() === us._id) {
                        return us;
                    }
                }

                return {};
            };
        });
        it('expect to return user if user was found', () => {
            const found = data.getUserById('596b1d2cfef2e82704d679e4');
            expect(found._id).to.deep.equal('596b1d2cfef2e82704d679e4');
        });

        it('expect to return null if user was not found', () => {
            const found = data.getUserById('59765842ec26b73928903cb8');
            expect(found).to.be.empty;
        });
    });

    describe('login()', () => {
        before(() => {
            findOne = (user) => {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username === user.username &&
                        users[i].password === user.password) {
                        return users[i];
                    }
                }

                return {};
            };
        });
        it('expect to return user if user was found', () => {
            const found = data.login('user', '123456');
            expect(found.username).to.deep.equal('user');
            expect(found.password).to.deep.equal('123456');
        });

        it('expect to return empty object username does not match', () => {
            const found = data.login('test', '123456');
            expect(found).to.be.empty;
        });

        it('expect to return empty object password does not match', () => {
            findOne = () => {
                return {};
            };
            const found = data.login('user', '1521');
            expect(found).to.be.empty;
        });
    });

    describe('create()', () => {
        it('expect to create user if isValidUser returns true', () => {
            const userToCreate = {
                username: 'testUser',
                password: '123456',
            };

            data.create(userToCreate);
            expect(users).to.deep.include(new User(userToCreate));
        });

        it('expect not to create user if isValidUser returns false', () => {
            validator.isValidUser.restore();
            sinon.stub(validator, 'isValidUser')
                .callsFake(() => {
                    return false;
                });
            const userToCreate = {
                username: 'not created',
                password: '123456',
            };
            data.create(userToCreate);

            expect(users).to.not.deep.include(new User(userToCreate));
        });
    });

    describe('getEvents()', () => {
        before(() => {
            findOne = (user) => {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username === user.username) {
                        return Promise.resolve(users[i]);
                    }
                }

                return Promise.resolve({});
            };
        });
        it('expect to return user\'s events', () => {
            data.getEvents('user')
                .then((foundEvents) => {
                    expect(foundEvents).to.be.deep.equal(events);
                });
        });
    });

    describe('addEventToUser()', () => {
        it('expect add new event to user\'s list of events', () => {
            data.addEventToUser('user', newEvent);
            expect(users[0].events).to.deep.include(newEvent);
        });
    });

    describe('updateProfile()', () => {
        before(() => {
            update = (userObj, anything) => {
                users[1].firstName = 'firstName';
                users[1].lastName = 'lastName';
                users[1].age = 'age';
                users[1].email = 'email';
                users[1].avatar = 'avatar';
            };
        });
        it('expect to update user\'s profile', () => {
            data.updateProfile('user', 'firstName', 'lastName',
                'age', 'email', 'avatar');

            expect(users).to.deep.include({
                _id: '596b2a0ae6239d22044adb29',
                username: 'user1',
                password: '234567',
                firstName: 'firstName',
                lastName: 'lastName',
                age: 'age',
                email: 'email',
                avatar: 'avatar',
            });
        });
    });

    describe('updateEvent()', () => {
        before(() => {
            update = (userObj, anything) => {
                users[0].events[0].title = 'new title';
                users[0].events[0].date = 'new date';
                users[0].events[0].time = 'new time';
                users[0].events[0].place = 'new place';
                users[0].events[0].details = 'new details';
                users[0].events[0].likes = 'new likes';
                users[0].events[0].photo = 'new photo';
            };
        });

        it('expect to update user\'s event', () => {
            data.updateEvent('user', 'new title', 'new date', 'new time',
                'new place', 'new details', 'new likes', 'new photo');

            expect(users[0].events).to.deep.include({
                title: 'new title',
                date: 'new date',
                time: 'new time',
                place: 'new place',
                details: 'new details',
                likes: 'new likes',
                photo: 'new photo',
            });
        });
    });

    describe('updateAvatar()', () => {
        before(() => {
            update = (userObj, anything) => {
                users[0].avatar = 'photo photo';
            };
        });

        it('expect to update user\'s avatar', () => {
            data.updateAvatar('user', 'photo photo');

            expect(users[0].avatar).to.deep.equal('photo photo');
        });
    });

    describe('removeEvent()', () => {
        before(() => {
            update = (userObj, anything) => {
                let index = 0;
                for (let i = 0; i < users[0].events.length; i++) {
                    if (users[0].events[i].title === 'Some event') {
                        index = i;
                        break;
                    }
                }

                users[0].events.slice(index, index + 1);
            };
        });

        it('expect to delete user\'s event', () => {
            data.removeEvent('user', 'new title', 'new date', 'new time',
                'new place', 'new details', 'new likes', 'new photo');

            expect(users[0].events).to.not.deep.include({
                title: 'Some event',
            });
        });
    });
});
