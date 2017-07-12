const Users = require('../models/user');
const Events = require('../models/event');

const init = (db) => {
    return Promise.resolve({
        users: new Users(db),
        events: new Events(db),
    });
};

module.exports = {
    init,
};
