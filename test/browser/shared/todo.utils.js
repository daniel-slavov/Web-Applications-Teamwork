const ui = require('./ui.utils');

const async = require('../../../utils/async');

const createTODO = (text) => {
    return async()
        .then(() => ui.click('#nav-todos .toggle'))
        .then(() => ui.click('#nav-todos-create'))
        .then(() => ui.setValue('input[name="text"]', text))
        .then(() => ui.click('form button'));
};

module.exports = { createTODO };