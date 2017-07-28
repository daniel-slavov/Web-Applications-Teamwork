let browser = null;

const ui = require('./ui.utils');
const async = require('../../../utils/async');

const signUpUser = (username, password) => {
    return async()
        .then(() => ui.click('#signup a'))
        .then(() => ui.setValue('input[name="username"]', username))
        .then(() => ui.setValue('input[name="password"]', password))
        .then(() => ui.setValue('input[name="passwordConfirm"]', password))
        .then(() => ui.click('form button'));
};

const signInUser = (username, password) => {
    return async()
        .then(() => ui.click('#login a'))
        .then(() => ui.setValue('input[name="username"]', username))
        .then(() => ui.setValue('input[name="password"]', password))
        .then(() => ui.click('form button'));
};

const getRandomUser = () => {
    const username = 'user-' + parseInt(Math.random() * (1 << 20), 10);
    const password = '123456';
    return {
        username,
        password,
    };
};

module.exports = {
    setBrowser(_browser) {
        browser = _browser;
        ui.setBrowser(browser);
    },
    signInUser, signUpUser,
    getRandomUser,
};
