const { expect } = require('chai');
const sinon = require('sinon');

describe('Events controller', () => {
    let data = null;
    let controller = null;
    const categories = ['Fun', 'Music', 'Sport', 'Outdoor'];
    const eventObj = {
        title: 'test',
    };

    let req = null;
    let res = null;

    beforeEach(() => {
        data = {
            categories: {
                addEventToCategory(category, event) {
                    return;
                },
                getAll() {
                    return Promise.resolve(categories);
                },
                getEventsByCategory(category) {
                    return Promise.resolve([]);
                },
            },
            events: {
                create(event) {
                    return;
                },
                getByTitle(title) {
                    return Promise.resolve(null);
                },
                getByDate(date) {
                    return Promise.resolve([]);
                },
                getAll() {
                    return Promise.resolve([]);
                },
            },
            users: {
                addEventToUser(user, event) {
                    return;
                },
            },
            chats: {
                getLatestMessages(title) {
                },
            },
        };

        controller =
            require('../../../../app/controllers/events.controller')(data);

        req = require('../../req-res').getRequestMock();
        res = require('../../req-res').getResponseMock();
    });

    describe('getCreateEvent', () => {
        it('should redirect to login if there is no logged in user', () => {
            const spy = sinon.spy(res, 'redirect');
            const route = '/login';

            controller.getCreateEvent(req, res);

            sinon.assert.calledWith(spy, route);
        });

        it('should render events/create view with categories if there is logged in user', () => {
            req = require('../../req-res').getRequestMock({
                user: {
                    username: 'test',
                },
            });

            return controller.getCreateEvent(req, res)
                .then(() => {
                    expect(res.context).to.be.deep.equal({
                        categories: categories,
                    });

                    expect(res.viewName).to.be.equal('events/create');
                });
        });
    });

    describe('postCreateEvent', () => {
        it('should redirect to login if there is no logged in user', () => {
            const spy = sinon.spy(res, 'redirect');
            const route = '/login';

            controller.postCreateEvent(req, res);

            sinon.assert.calledWith(spy, route);
        });

        it('should render events/create view with validation errors if validation do not pass', () => {
            const result = {
                isEmpty: function() {
                    return false;
                },
                array: function() {
                    return [];
                },
            };

            req = require('../../req-res').getRequestMock({
                user: {
                    username: 'test',
                },
                body: {
                    title: 'test event',
                    place: 'Sofia',
                },
                assert: function() {
                    return this;
                },
                len: function(first, second) {
                    return this;
                },
                isDate: function(pass) {
                    return this;
                },
                notEmpty: function() {
                    return this;
                },
                getValidationResult: function() {
                    return new Promise((resolve, rej) => {
                        resolve(result);
                    });
                },
            });

            controller.postCreateEvent(req, res);
            return controller.postCreateEvent(req, res)
                .then(() => {
                    expect(res.context).to.be.deep.equal({
                        event: req.body,
                        categories: categories,
                        errors: result.array(),
                    });

                    expect(res.viewName).to.be.equal('events/create');
                });
        });

        it('should call methods create, addEventToCategory and addEventToUser, and redirect if validation passes', () => {
            const result = {
                isEmpty: function() {
                    return true;
                },
                array: function() {
                    return [];
                },
            };

            req = require('../../req-res').getRequestMock({
                user: {
                    username: 'test',
                },
                body: {
                    title: 'test event',
                    place: 'Sofia',
                    categories: categories,
                },
                assert: function() {
                    return this;
                },
                len: function(first, second) {
                    return this;
                },
                isDate: function(pass) {
                    return this;
                },
                notEmpty: function() {
                    return this;
                },
                getValidationResult: function() {
                    return new Promise((resolve, rej) => {
                        resolve(result);
                    });
                },
            });

            const responseSpy = sinon.spy(res, 'redirect');
            const eventsSpy = sinon.spy(data.events, 'create');
            const catSpy = sinon.spy(data.categories, 'addEventToCategory');
            const usersSpy = sinon.spy(data.users, 'addEventToUser');
            const route = '/events/' + req.body.title;

            return controller.postCreateEvent(req, res)
                .then(() => {
                    sinon.assert.calledWith(eventsSpy, req.body);

                    sinon.assert.called(catSpy);

                    sinon.assert.calledWith(usersSpy, req.body.user, req.body);

                    sinon.assert.calledWith(responseSpy, route);
                });
        });
    });

    describe('getEventByTitle', () => {
        it('should call getLatestMessages and render event/details view with context', () => {
            req = require('../../req-res').getRequestMock({
                params: {
                    title: 'Test',
                },
            });
            const messages = ['hello', 'hi'];
            const spy = sinon.spy(data.chats, 'getLatestMessages');

            sinon.stub(data.events, 'getByTitle').returns(Promise.resolve(eventObj));

            sinon.stub(data.chats, 'getLatestMessages').returns(Promise.resolve(messages));

            return controller.getEventByTitle(req, res)
                .then(() => {
                    sinon.assert.calledWith(spy, eventObj.title);

                    expect(res.context).to.be.deep.equal({
                        event: eventObj,
                        chat: messages,
                        user: req.user,
                    });

                    expect(res.viewName).to.be.equal('events/details');
                });
        });

        it('should redirect to /error if event with that title has not been found', () => {
            req = require('../../req-res').getRequestMock({
                params: {
                    title: 'Test',
                },
            });

            const spy = sinon.spy(res, 'redirect');
            const route = '/error';

            sinon.stub(data.events, 'getByTitle')
                .returns(Promise.resolve(null));

            return controller.getEventByTitle(req, res)
                .then(() => {
                    sinon.assert.calledWith(spy, route);
                });
        });
    });

    describe('getAllCategories', () => {
        it('should render categories/all view with categories context', () => {
            return controller.getAllCategories(req, res)
                .then(() => {
                    expect(res.context).to.be.deep.equal({
                        categories: categories,
                    });

                    expect(res.viewName).to.be.equal('categories/all');
                });
        });
    });

    describe('getEventsByCategory', () => {
        it('should render partials/events without context if no events are found', () => {
            req = require('../../req-res').getRequestMock({
                params: {
                    name: 'Fun',
                },
            });

            return controller.getEventsByCategory(req, res)
                .then(() => {
                    expect(res.context).to.be.undefined;

                    expect(res.viewName).to.be.equal('partials/events');
                });
        });

        it('should render partials/events with context if events are found', () => {
            req = require('../../req-res').getRequestMock({
                params: {
                    name: 'Fun',
                },
            });

            const events = [eventObj, eventObj];

            sinon.stub(data.categories, 'getEventsByCategory')
                .returns(Promise.resolve(events));

            return controller.getEventsByCategory(req, res)
                .then(() => {
                    expect(res.context).to.be.deep.equal({
                        events: events,
                    });

                    expect(res.viewName).to.be.equal('partials/events');
                });
        });
    });

    describe('getAllEventsByCategory', () => {
        beforeEach(() => {
            req = require('../../req-res').getRequestMock({
                params: {
                    name: 'Fun',
                },
            });
        });

        it('should render events/events view and title as context if no events are found', () => {
            sinon.stub(data.categories, 'getEventsByCategory')
                .returns(Promise.resolve([]));

            return controller.getAllEventsByCategory(req, res)
                .then(() => {
                    expect(res.context).to.be.deep.equal({
                        title: req.params.name,
                    });

                    expect(res.viewName).to.be.equal('events/events');
                });
        });

        it('should render events/events view and title and events as context if some events are found', () => {
            const events = [eventObj, eventObj];

            sinon.stub(data.categories, 'getEventsByCategory')
                .returns(Promise.resolve(events));

            return controller.getAllEventsByCategory(req, res)
                .then(() => {
                    expect(res.context).to.be.deep.equal({
                        title: req.params.name,
                        events: events,
                    });

                    expect(res.viewName).to.be.equal('events/events');
                });
        });
    });

    describe('getCalendar', () => {
        it('should render calendar view', () => {
            controller.getCalendar(req, res);

            expect(res.viewName).to.be.equal('calendar/calendar');
        });
    });

    describe('getAllEventsByDate', () => {
        beforeEach(() => {
            req = require('../../req-res').getRequestMock({
                params: {
                    date: '2017-07-30',
                },
            });
        });

        it('should render partials/events without context if no events are found', () => {
            return controller.getAllEventsByDate(req, res)
                .then(() => {
                    expect(res.context).to.be.undefined;

                    expect(res.viewName).to.be.equal('partials/events');
                });
        });

        it('should render partials/events with found events as context', () => {
            const events = [eventObj, eventObj];

            sinon.stub(data.events, 'getByDate').returns(Promise.resolve(events));

            return controller.getAllEventsByDate(req, res)
                .then(() => {
                    expect(res.context).to.be.deep.equal({
                        events: events,
                    });

                    expect(res.viewName).to.be.equal('partials/events');
                });
        });
    });

    describe('getAllEvents', () => {
        it('should render events view without context if events are not found', () => {
            return controller.getAllEvents(req, res)
                .then(() => {
                    expect(res.context).to.be.undefined;

                    expect(res.viewName).to.be.equal('events');
                });
        });

        it('should render events view with found events as context', () => {
            const events = [eventObj, eventObj];

            sinon.stub(data.events, 'getAll').returns(Promise.resolve(events));

            return controller.getAllEvents(req, res)
                .then(() => {
                    expect(res.context).to.be.deep.equal({
                        events: events,
                    });

                    expect(res.viewName).to.be.equal('events');
                });
        });
    });
});
