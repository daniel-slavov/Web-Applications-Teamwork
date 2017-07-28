const { expect } = require('chai');
const { setupDriver } = require('../utils/setup-driver');
// const webdriver = require('selenium-webdriver');
const async = require('../../../utils/async');
const ui = require('../shared/ui.utils');
const authUtils = require('../shared/auth.utils');
const browsers = ['chrome'];

describe('Navigation: ', () => {
    const url = 'http://localhost:3003/';
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
    describe('Public pages: ', () => {
        it('EventsBox', () => {
            return async()
            .then(() => ui.click('#logoBtn'))
            .then(() => driver.getCurrentUrl())
            .then((currentUrl) => {
                expect(currentUrl).to.be.eql(url);
            });
        });

        it('Home page', () => {
            return async()
            .then(() => ui.click('#homeBtn'))
            .then(() => driver.getCurrentUrl())
            .then((currentUrl) => {
                expect(currentUrl).to.be.eql(url);
            });
        });

        it('Categories page', () => {
            return async()
            .then(() => ui.click('#categoriesBtn'))
            .then(() => driver.getCurrentUrl())
            .then((currentUrl) => {
                expect(currentUrl).to.be.eql(`${url}categories`);
            });
        });

        it('Calendar page', () => {
            return async()
            .then(() => ui.click('#calendarBtn'))
            .then(() => driver.getCurrentUrl())
            .then((currentUrl) => {
                expect(currentUrl).to.be.eql(`${url}events-calendar`);
            });
        });

        it('Search page', () => {
            return async()
            .then(() => ui.click('#searchBtn'))
            .then(() => driver.getCurrentUrl())
            .then((currentUrl) => {
                expect(currentUrl).to.be.eql(`${url}search`);
            });
        });
    });

    describe('Private pages: ', () => {
        const user = authUtils.getRandomUser();

        beforeEach(() => {
            return driver
                .then(() => authUtils.signUpUser(user.username, user.password))
                .then(() => authUtils.signInUser(user.username, user.password));
        });

        it('Create event page', () => {
            return async()
            .then(() => ui.click('#createEventBtn'))
            .then(() => driver.getCurrentUrl())
            .then((currentUrl) => {
                expect(currentUrl).to.be.eql(`${url}events/create`);
            });
        });

        it('Profile page', () => {
            return async()
            .then(() => ui.click('#username'))
            .then(() => driver.getCurrentUrl())
            .then((currentUrl) => {
                expect(currentUrl).to.be.eql(`${url}users/${user.username}`);
            });
        });
    });
});
