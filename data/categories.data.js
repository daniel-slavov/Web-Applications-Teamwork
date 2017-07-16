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
        return this.collection
            .find({ name: categoryName })
            .toArray()
            .then((foundCategory) => {
                return foundCategory[0].events;
            });
    }

    addEventToCategory(categoryName, event) {
        this.collection.update(
            { name: categoryName },
            { $push: { events: event } }
        );
    }
}

module.exports = CategoriesData;
