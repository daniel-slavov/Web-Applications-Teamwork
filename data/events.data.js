const Event = require('../models/event');

class EventsData {
    constructor(db, validator) {
        this.db = db;
        this.collection = this.db.collection('events');
        this.validator = validator;
    }

    create(eventObj) {
        // console.log(eventObj);

        if (this.validator.isValidEvent(eventObj)) {
            const newEvent = new Event(eventObj);
            this.collection.insert(newEvent);
        }
    }

    getByTitle(title) {
        return this.collection.find({ title: title })
            .toArray();
    }

    getByDate(date) {
        return this.collection.find({ date: date })
            .toArray();
    }

    getById(id) {
        return this.collection.findOne({ _id: id });
    }

    getUpcoming() {
        return this.collection.aggregate([
            { $sort: { date: -1 } },
            { $limit: 2 },
        ]).toArray();
    }

    update(eventTitle, date, time, place, details, photo) {
        this.collection.update(
            { title: eventTitle },
            { $set: { date: date,
                time: time,
                place: place,
                details: details,
                photo: photo,
            } }
        );
    }

    updateLikes(eventTitle, likes) {
        this.collection.update(
           { title: eventTitle },
            { $set: { likes: likes } }
        );
    }

    remove(eventTitle) {
        this.collection.remove(
            { title: eventTitle }
        );
    }
}

module.exports = EventsData;
