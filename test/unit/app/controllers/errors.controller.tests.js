const { expect } = require('chai');

describe('Errors controller', () => {
    let controller = null;

    let req = null;
    let res = null;

    beforeEach(() => {
        controller =
        require('../../../../app/controllers/errors.controller')();

        req = require('../../req-res').getRequestMock();
        res = require('../../req-res').getResponseMock();
    });

    describe('show', () => {
        it('should render error page', () => {
            controller.show(req, res);

            expect(res.viewName).to.be.equal('error');
        });
    });
});
