const { expect } = require('chai');

describe('Users controller', () => {
    let data = null;
    let controller = null;
    const user = {
        username: 'test',
    };
    let foundItems = [];

    let req = null;
    let res = null;

    beforeEach(() => {
        data = {
            users: {
                getUser(username) {
                    return Promise.resolve(user);
                },
                getEvents(username) {
                    return Promise.resolve(foundItems);
                },
                getUserByPattern(pattern) {
                    return Promise.resolve(foundItems);
                },
            },
        };

        controller =
        require('../../../../app/controllers/users.controller')(data);

        req = require('../../req-res').getRequestMock();
        res = require('../../req-res').getResponseMock();
    });

    describe('getLogin', () => {
        it('should render login view if there is no authenticated user', () => {
            controller.getLogin(req, res);

            expect(res.viewName).to.be.equal('login');
        });
    });

    describe('getSignup', () => {
        it('should render signup view if there is no authenticated user',
        () => {
            controller.getSignup(req, res);

            expect(res.viewName).to.be.equal('signup');
        });
    });

    describe('postSignup', () => {
        it(`should render signup view again and return 
            status code 400 if server validation did not pass`,
        () => {
            // TO DO
        });
    });

    describe('getUserProfile', () => {
        it(`should render users/profile view without current
            user if there is no authenticated user`, () => {
                req = require('../../req-res').getRequestMock({
                    params: { username: 'test' },
                });

                return controller.getUserProfile(req, res)
                    .then(() => {
                        expect(res.context).to.be.deep.equal({
                            context: user,
                        });

                        expect(res.viewName).to.be.equal('users/profile');
                    });
        });

        it(`should render users/profile view with current
            user if there is authenticated user`, () => {
                req = require('../../req-res').getRequestMock({
                    user: user,
                    params: { username: 'simona' },
                });

                return controller.getUserProfile(req, res)
                    .then(() => {
                        expect(res.context).to.be.deep.equal({
                            context: user,
                            currentUser: req.user.username,
                        });

                        expect(res.viewName).to.be.equal('users/profile');
                    });
        });
    });

    describe('updateUserProfile', () => {
        it(`should render all errors if there 
        is error in server validation`, () => {
            // TO DO
        });
    });

    describe('getUserEvents', () => {
        it(`should render partials/events view 
            without context if no events were found`, () => {
            req = require('../../req-res').getRequestMock({
                params: { username: 'test' },
            });

            return controller.getUserEvents(req, res)
                .then(() => {
                    expect(res.viewName).to.be.equal('partials/events');
                });
        });

        it(`should render partials/events view 
            with context if some events were found`, () => {
            req = require('../../req-res').getRequestMock({
                params: { username: 'test' },
            });
            foundItems = [1, 2, 3, 4];

            return controller.getUserEvents(req, res)
                .then(() => {
                    expect(res.context).to.be.deep.equal({
                        events: foundItems,
                    });

                    expect(res.viewName).to.be.equal('partials/events');
                });
        });
    });

    describe('searchUser', () => {
        it(`should render partials/users view
            if isPartial query parameter is specified`, () => {
                req = require('../../req-res').getRequestMock({
                    query: {
                        name: 'pattern',
                        isPartial: true,
                    },
                });
                foundItems = [1, 2, 3, 4];

                return controller.searchUser(req, res)
                    .then(() => {
                        expect(res.context).to.be.deep.equal({
                            users: foundItems,
                        });

                        expect(res.viewName).to.be.equal('partials/users');
                    });
        });

        it(`should render search/search view
            if isPartial query parameter is not specified`, () => {
                req = require('../../req-res').getRequestMock({
                    query: {
                        name: 'pattern',
                    },
                });
                foundItems = [1, 2, 3, 4];

                return controller.searchUser(req, res)
                    .then(() => {
                        expect(res.context).to.be.deep.equal({
                            title: req.query.name,
                            users: foundItems,
                        });

                        expect(res.viewName).to.be.equal('search/search');
                    });
        });
    });
});
