const { expect } = require('chai');

describe('Home controller', () => {
    let data = null;
    let controller = null;
    const items = ['1', '2', '3', '4'];

    let req = null;
    let res = null;

    beforeEach(() => {
        data = {
            events: {
                getUpcoming() {
                    return Promise.resolve(items);
                },
            },
        };

        controller =
        require('../../../../app/controllers/home.controller')(data);

        req = require('../../req-res').getRequestMock();
        res = require('../../req-res').getResponseMock();
    });

    describe('index', () => {
        it('should render home view with upcoming events', () => {
            return controller.index(req, res)
                .then(() => {
                   expect(res.context).to.be.deep.equal({
                        user: req.user,
                        events: items,
                   });
                   expect(res.viewName).to.be.equal('home');
                });
        });
    });

    describe('search', () => {
        it('should render search page', () => {
            controller.search(req, res);

            expect(res.viewName).to.be.equal('search/search');
        });
    });
});
