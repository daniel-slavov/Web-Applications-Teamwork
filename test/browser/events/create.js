const { expect } = require('chai');
const { setupDriver } = require('../utils/setupDriver');

describe('Events creation', () => {
    let driver = null;

    beforeEach(() => {
        driver = setupDriver('chrome');
    });

})