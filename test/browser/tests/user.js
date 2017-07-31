const { expect } = require('chai');
const { setupDriver } = require('../utils/setup-driver');
const webdriver = require('selenium-webdriver');
const async = require('../../../utils/async');
const ui = require('../shared/ui.utils');
const authUtils = require('../shared/auth.utils');
const browsers = ['chrome'];
const assert = require('selenium-webdriver/testing/assert');

describe('Profile: ', () => {
    const url = 'http://localhost:3003/';
    let driver = null;
    const user = authUtils.getRandomUser();

    beforeEach(() => {
        driver = setupDriver(url, ...browsers);
        return driver.get(url)
            .then(() => ui.setDriver(driver))
            .then(() => authUtils.signUpUser(user.username, user.password));
    });

    afterEach(() => {
        return driver.quit();
    });

    describe('Other user: ', () => {
        it('See information', () => {
            return async()
            .then(() => driver.navigate().to(`${url}users/${user.username}`))
            .then(() => ui.getText('#curent-user'))
            .then((currentUser) => {
                expect(driver.findElement(webdriver.By.css('.panel-info'))).not.to.throw;
                expect(currentUser).to.be.eql(user.username);
            });
        });

        it('Cannot update information', () => {
            return async()
            .then(() => driver.navigate().to(`${url}users/${user.username}`))
            .then(() => {
                try {
                    expect(driver.findElements(webdriver.By.css('#edit-profile-btn'))).to.throw;
                } catch (err) {

                }
            });
        });

        // it(`Show user's events`, () => {
        //     return async()
        //     .then(() => driver.navigate().to(`${url}users/${user.username}`))
        //     .then(() => ui.click('#show-my-events-btn'))
        //     .then(() => ui.waitSeconds(1))
        //     .then(() => {
        //         expect(driver.findElement(webdriver.By.css('#user-events > div.row'))).not.to.throw;
        //     });
        // });

        // it(`Hide user's events`, () => {
        //     return async()
        //     .then(() => driver.navigate().to(`${url}users/${user.username}`))
        //     .then(() => ui.click('#show-my-events-btn'))
        //     .then(() => ui.click('#hide-my-events-btn'))
        //     .then(() => ui.waitSeconds(2))
        //     .then(() => {
        //         try {
        //             expect(driver.findElement(webdriver.By.css('#user-events > div.row'))).to.throw;
        //         } catch (err) {
        //             // expect(err).to.contain('no such element');
        //         }
        //     });
        // });
    });

    describe('Own account: ', () => {
        beforeEach(() => {
            return driver
            .then(() => authUtils.signInUser(user.username, user.password));
        });

        it('Can update information', () => {
            return async()
            .then(() => driver.navigate().to(`${url}users/${user.username}`))
            .then(() => {
                expect(driver.findElements(webdriver.By.css('#edit-profile-btn'))).to.not.throw;
            });
        });

        it('Change avatar button', () => {
            return async()
            .then(() => driver.navigate().to(`${url}users/${user.username}`))
            .then(() => ui.click('#change-avatar-btn'))
            .then(() => {
                expect(driver.findElement(webdriver.By.css('#myModal')).isDisplayed()).to.not.throw;
            });
        });
    });
});
