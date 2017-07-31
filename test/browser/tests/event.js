const { expect } = require('chai');
const { setupDriver } = require('../utils/setup-driver');
const webdriver = require('selenium-webdriver');
const async = require('../../../utils/async');
const ui = require('../shared/ui.utils');
const authUtils = require('../shared/auth.utils');
const eventUtils = require('../shared/event.utils');
const browsers = ['chrome'];

describe('Authentication: ', () => {
    const url = 'http://localhost:3003/';
    let driver = null;
    const user = authUtils.getRandomUser();
    const event = eventUtils.getRandomEvent();

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

    it('Crete test event', () => {
        return async()
        .then(() => authUtils.signUpUser(user.username, user.password))
        .then(() => authUtils.signInUser(user.username, user.password))
        .then(() => ui.click('#createEventBtn a'))
        .then(() => eventUtils.createEvent(event))
        .then(() => ui.getText('#title'))
        .then((text) => {
            expect(text).to.eql(event.title);
        });
    });

    it('Edit event', () => {
        return async()
        .then(() => driver.navigate().to(url))
        .then(() => authUtils.signInUser(user.username, user.password))
        .then(() => ui.click('#username a'))
        .then(() => ui.click('#show-my-events-btn'))
        .then(() => ui.click('.single-event > div > a'))
        .then(() => ui.click('#update-event-button'))
        .then(() => ui.setValue('#details input', '-updated'))
        .then(() => ui.click('#confirm-event-button'))
        .then(() => ui.getText('#details span'))
        .then((text) => {
            expect(text).to.eql('test-updated');
        });
    });

    it('Delete event', () => {
        return async()
        .then(() => driver.navigate().to(url))
        .then(() => authUtils.signInUser(user.username, user.password))
        .then(() => ui.click('#username a'))
        .then(() => ui.click('#show-my-events-btn'))
        .then(() => ui.click('.single-event > div > a'))
        .then(() => ui.click('#delete-event-button'))
        .then(() => {
            driver.switchTo().alert().accept();
        })
        .then(() => ui.waitSeconds(1))
        .then(() => driver.getCurrentUrl())
        .then((currentUrl) => {
            expect(currentUrl).to.eql(url);
        });
    });
});
