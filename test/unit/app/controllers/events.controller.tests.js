const { expect } = require('chai');

describe('Events controller', () => {
    let data = null;
    let controller = null;

    let req = null;
    let res = null;

    beforeEach(() => {
        data = {
            events: {

            },
        };

        controller =
            require('../../../../app/controllers/events.controller')(data);

        req = require('../../req-res').getRequestMock();
        res = require('../../req-res').getResponseMock();
    });
});
