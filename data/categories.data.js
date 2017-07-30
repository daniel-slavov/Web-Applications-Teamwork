const Category = require('../models/category');

class CategoriesData {
    constructor(db, validator) {
        this.db = db;
        this.collection = this.db.collection('categories');
        this.validator = validator;
    }

    create(categoryObj) {
        if (this.validator.isValidCategory(categoryObj)) {
            const newCategory = new Category(categoryObj);
            this.collection.insertOne(newCategory);
        }
    }

    getAll() {
        return this.collection
            .find({})
            .toArray();
    }

    getEventsByCategory(categoryName) {
        // console.log(categoryName);
        return this.collection
            .findOne({ name: categoryName })
            .then((foundCategory) => {
                // console.log(foundCategory.events);
                return foundCategory.events;
            });
    }

    addEventToCategory(categoryName, event) {
        this.collection.update(
            { name: categoryName },
            { $push: { events: event } }
        );
    }

    updateEvent(categoryName, eventTitle, date, time, place, details,
            categories, likes, photo, user) {
        this.collection.update({
            name: categoryName,
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
                user: user,
                },
            },
        });
    }

    removeEvent(categoryName, event) {
        this.collection.update(
            { name: categoryName },
            { $pull: { events: { title: event.title } } }
        );
    }
}

module.exports = CategoriesData;
