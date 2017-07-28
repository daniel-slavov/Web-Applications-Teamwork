const { expect } = require('chai');
const { setupDriver } = require('../utils/setup-driver');
const webdriver = require('selenium-webdriver');
const async = require('../../../utils/async');
const ui = require('../shared/ui.utils');
const authUtils = require('../shared/auth.utils');
const browsers = ['chrome'];

describe('Search: ', () => {
    const url = 'http://localhost:3003/search';
    let driver = null;

    beforeEach(() => {
        driver = setupDriver(url, ...browsers);
        return driver.get(url)
            .then(() => {
                return ui.setDriver(driver);
            });
    });

    afterEach(() => {
        return driver.quit();
    });

    const searchWord = 'test';

    it('Events', () => {
        return async()
        .then(() => ui.setValue('input[name="pattern"]', searchWord))
        .then(() => ui.click('#events-option'))
        .then(() => ui.click('#search-btn'))
        .then(() => ui.waitSeconds(1))
        .then(() => driver.getCurrentUrl())
        .then((currentUrl) => {
            expect(currentUrl).to.be.eql(`${url}/events?name=${searchWord}`);
        });
    });

    it('Users', () => {
        return async()
        .then(() => ui.setValue('input[name="pattern"]', searchWord))
        .then(() => ui.click('#users-option'))
        .then(() => ui.click('#search-btn'))
        .then(() => ui.waitSeconds(1))
        .then(() => driver.getCurrentUrl())
        .then((currentUrl) => {
            expect(currentUrl).to.be.eql(`${url}/users?name=${searchWord}`);
        });
    });
});
