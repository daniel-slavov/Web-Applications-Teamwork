class CategoriesData {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('categories');
    }

    getAll() {
        return this.collection
            .find({})
            .toArray();
    }

    getEventsByCategory(categoryName) {
        return this.collection
            .findOne({ name: categoryName })
            .then((foundCategory) => {
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
