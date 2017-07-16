const User = require('../models/user');

class UsersData {
    constructor(db, validator) {
        this.db = db;
        this.collection = this.db.collection('users');
        this.validator = validator;
    }

    create(userObj) {
        if (this.validator.isValidUser) {
            const newUser = new User(userObj);
            this.collection.insertOne(newUser);
        }
    }

    getEvents(username) {
        return this.getUser(username)
            .then((users) => {
                return users[0].events;
            });
    }

    addEventToUser(username, event) {
        this.collection.update(
            { username: username },
            { $push: { events: event } }
        );
    }

    login(username, password) {
        return this.collection
            .find({ username: username, password: password })
            .toArray();
    }

    getUser(username) {
        return this.collection
            .find({ username: username })
            .toArray();
    }

    updateProfile(username, firstName, lastName, age, email, avatar) {
            this.collection
                .update({ username: username },
                {
                    $set: {
                        firstName: firstName,
                        lastName: lastName,
                        age: age,
                        email: email,
                        avatar: avatar,
                    },
                });
    }

    removeEvent(username, eventTitle) {
        this.collection.update(
            { username: username },
            { $pull: { events: { $in: [{ title: eventTitle }] } } },
            { multi: true }
        );
    }
}

module.exports = UsersData;
