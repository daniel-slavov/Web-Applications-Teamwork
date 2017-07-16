const UsersData = require('./users.data');
const EventsData = require('./events.data');
const CategoriesData = require('./categories.data');

const validator = {
    isValidUser(user) {
        return true;
    },
    isValidEvent(event) {
        return true;
    },
    isValidCategory(category) {
        return true;
    },
};

const init = (db) => {
    return Promise.resolve({
        users: new UsersData(db, validator),
        events: new EventsData(db, validator),
        categories: new CategoriesData(db, validator),
    });
};

module.exports = {
    init,
};
