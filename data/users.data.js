const User = require('../models/user');
const { ObjectID } = require('mongodb');

class UsersData {
    constructor(db, validator) {
        this.db = db;
        this.collection = this.db.collection('users');
        this.validator = validator;
    }

    create(userObj) {
        if (this.validator.isValidUser(userObj)) {
            const newUser = new User(userObj);
            this.collection.insertOne(newUser);
        }
    }

    getEvents(username) {
        return this.getUser(username)
            .then((user) => {
                return user.events;
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
            .findOne({ username: username, password: password });
    }

    getUser(username) {
        return this.collection
            .findOne({ username: username });
    }

    getUserByPattern(pattern) {
        return this.collection
            .find({ 'username': { '$regex': pattern, $options: 'i' } })
            .toArray();
    }

    getUserById(id) {
        return this.collection
            .findOne({ _id: new ObjectID(id) });
    }

    updateProfile(username, firstName, lastName, age, email) {
        this.collection
            .update({ username: username },
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    age: age,
                    email: email,
                },
            });
    }

    updateEvent(username, eventTitle, date, time, place, details,
        categories, likes, photo) {
        this.collection.update({
            username: username,
            'events.title': eventTitle,
        }, {
                $set: {
                    'events.$': {
                        title: eventTitle,
                        date: date,
                        time: time,
                        place: place,
                        details: details,
                        categories: categories,
                        likes: likes,
                        photo: photo,
                        user: username,
                    },
                },
            });
    }

    updateAvatar(username, avatar) {
        this.collection.update(
            { username: username },
            { $set: { avatar: avatar } }
        );
    }

    updateVotedEvents(username, eventTitle) {
        this.collection.update(
            { username: username },
            { $push: { votedEvents: eventTitle } },
        );
    }

    removeEvent(username, eventTitle) {
        this.collection.update(
            { username: username },
            { $pull: { events: { title: eventTitle } } },
            { multi: true }
        );
    }
}

module.exports = UsersData;
