const { setupDriver } = require('../utils/setup.driver.js');

describe('Tests', () => {
    let driver = null;
    
    beforeEach(() => {
        driver = setupDriver('chrome');
    });


    it('telerikacademy.com title', () => {
        return driver.get('http://telerikacademy.com')
            .then(() => {
                return driver.getTitle();
            })
            .then((title) => {
                expect(title).to.equal(expectedTitle);
            });
    });
})