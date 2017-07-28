const { expect } = require('chai');
const { setupDriver } = require('../utils/setup-driver');
const webdriver = require('selenium-webdriver');
const async = require('../../../utils/async');
const ui = require('../shared/ui.utils');
const authUtils = require('../shared/auth.utils');
const browsers = ['chrome'];

describe('Tests', () => {
    const url = 'http://localhost:3003';
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

    describe('Authentication: ', () => {
        const user = authUtils.getRandomUser();
        it('Should create user', () => {
            return async()
            .then(() => authUtils.signUpUser(user.username, user.password))
            .then(() => driver.getCurrentUrl())
            .then((currentUrl) => {
                expect(currentUrl).to.eql(`${url}/login`);
            });
        });

        it('Should login user', () => {
            return async()
            .then(() => authUtils.signInUser(user.username, user.password))
            .then(() => ui.getText('#username a'))
            .then((text) => {
                expect(text).to.eql(user.username);
            });
        });

        it('Should logout user', () => {
            return async()
            .then(() => authUtils.signInUser(user.username, user.password))
            .then(() => ui.click('#logout a'))
            .then(() => driver.findElement(webdriver.By.css('#login')))
            .then((element) => {
                expect(element).not.to.be.undefined;
            });
        });
    });
});
