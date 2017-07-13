const UsersData = require('./users.data');
const EventsData = require('./events.data');
const CategoriesData = require('./categories.data');

const init = (db) => {
    return Promise.resolve({
        users: new UsersData(db),
        events: new EventsData(db),
        categories: new CategoriesData(db),
    });
};

module.exports = {
    init,
};
