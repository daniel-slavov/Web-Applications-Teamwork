let browser = null;

const ui = require('./ui.utils');
const async = require('../../../utils/async');

const createEvent = (event) => {
    return async()
        .then(() => ui.setValue('#title', event.title))
        .then(() => ui.setValue('#date', event.date))
        .then(() => ui.setValue('#time', event.time))
        .then(() => ui.setValue('#place', event.place))
        .then(() => ui.setValue('#details', event.details))
        .then(() => ui.click('.form-control > option'))
        .then(() => ui.click('.btn-success'));
};

const getRandomEvent = () => {
    const title = 'event-' + parseInt(Math.random() * (1 << 20), 10);
    const date = '2017-08-01';
    const time = '12:00:00';
    const place = 'Sofia';
    const details = 'test';
    return {
        title,
        date,
        time,
        place,
        details,
    };
};

module.exports = {
    getRandomEvent,
    createEvent,
};
