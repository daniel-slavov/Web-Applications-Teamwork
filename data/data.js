const UsersData = require('./users.data');
const EventsData = require('./events.data');
const CategoriesData = require('./categories.data');
const { Validator } = require('../utils/validator');

const init = (db) => {
    return Promise.resolve({
        users: new UsersData(db, Validator),
        events: new EventsData(db, Validator),
        categories: new CategoriesData(db, Validator),
    });
};

module.exports = {
    init,
};
