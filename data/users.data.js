const User = require('../models/user');

class UsersData {
     constructor(db) {
        this.db = db;
        this.collection = this.db.collection('users');
    }

    create(username, password, firstName, lastName, email, age, avatar) {
        const newUser = new User(username, password, firstName, lastName,
                                email, age, avatar);
        this.collection.insertOne(newUser);
    }

    getEvents(username) {
        return this.collection
            .find({ username: username })
            .toArray((err, user) => {
                if (user.length === 0) {
                    throw new Error('Invalid user!');
                } else {
                    return user.events;
                }
            });
    }

    addEvent(username, event) {
        this.collection.find({ username: username })
            .toArray((err, user) => {
                if (user.length === 0) {
                    throw new Error('Invalid user!');
                } else {
                    user.events.push(event);
                }
            });
    }

    login(username, password) {
        return this.collection
            .find({ username: username, password: password })
            .toArray((err, user) => {
                if (user.length === 0) {
                    throw new Error('Invalid user!');
                } else {
                    return user;
                }
            });
    }

    getProfile(username) {
        return this.collection
            .find({ username: username })
            .toArray((err, user) => {
                if (user.length === 0) {
                    throw new Error('Invalid user!');
                } else {
                    return user;
                }
            });
    }

    updateProfile(username, firstName, lastName, email, age) {
        this.collection
            .update({ username: username },
                    { $set: { firstName: firstName, lastName: lastName,
                            age: age, email: email } });
    }
}

module.exports = UsersData;
