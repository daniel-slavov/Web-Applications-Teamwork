const Event = require('../models/event');

class EventsData {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('events');
    }

    create(title, date, time, place, categories,
        likes, user, details, photo) {
            const newEvent = new Event(title, date, time, place, categories,
                            likes, user, details, photo);
            this.collection.insert(newEvent);
    }

    getByDate(date) {
        return this.collection.find({ date: date })
                    .toArray((err, events) => {
                        return events;
                    });
    }

    getById(id) {
        return this.collection.findOne({ _id: id });
    }

    getUpcoming() {

    }

    update() {

    }
}

module.exports = EventsData;
