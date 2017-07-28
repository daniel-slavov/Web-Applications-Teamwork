const { expect } = require('chai');
const { setupDriver } = require('../utils/setup.driver.js');

describe('Events creation', () => {
    let driver = null;
    const appUrl = 'http://localhost:3003';

    beforeEach(() => {
        driver = setupDriver('chrome');
    });

    it('All events page', (done) => {
        return driver.get(appUrl)
            .then(() => {
                return driver.getTitle();
            })
            .then((title) => {
                console.log(title);
                expect(title).not.to.be.undefined;
                done();
            });
    });
});
