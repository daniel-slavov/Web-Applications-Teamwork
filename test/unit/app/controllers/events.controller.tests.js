const { expect } = require('chai');
const sinon = require('sinon');

describe('Events controller', () => {
    let data = null;
    let controller = null;
    const categories = ['Fun', 'Music', 'Sport', 'Outdoor'];
    const eventObj = {
        title: 'test',
        user: 'test',
        likes: 0,
        photo: 'photo.png',
        categories: 'Fun',
    };

    let req = null;
    let res = null;
    let result = null;

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
                updateEvent() {
                    return;
                },
                removeEvent(category, event) {
                    return;
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
                update() {
                    return;
                },
                remove(title) {
                    return;
                },
                getByTitlePattern(pattern) {
                    return Promise.resolve([eventObj, eventObj]);
                },
            },
            users: {
                addEventToUser(user, event) {
                    return;
                },
                updateEvent() {
                    return;
                },
                removeEvent(username, event) {
                    return;
                },
            },
            chats: {
                getLatestMessages(title) {
                },
                removeChatRoom(title) {
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
        beforeEach(() => {
            result = {
                isEmpty: function () {
                    return true;
                },
                array: function () {
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
                    categories: ['Fun', 'Music'],
                },
                assert: function () {
                    return this;
                },
                len: function (first, second) {
                    return this;
                },
                isDate: function (pass) {
                    return this;
                },
                notEmpty: function () {
                    return this;
                },
                getValidationResult: function () {
                    return new Promise((resolve, rej) => {
                        resolve(result);
                    });
                },
            });
        });

        it('should redirect to login if there is no logged in user', () => {
            req.user = undefined;
            const spy = sinon.spy(res, 'redirect');
            const route = '/login';

            controller.postCreateEvent(req, res);

            sinon.assert.calledWith(spy, route);
        });

        it('should render events/create view with validation errors if validation do not pass', () => {
            sinon.stub(result, 'isEmpty').returns(false);

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
        it('should call getLatestMessages to get chat messages for this event', () => {
            req = require('../../req-res').getRequestMock({
                params: {
                    title: 'Test',
                },
            });
            const messages = ['hello', 'hi'];
            const spy = sinon.spy(data.chats, 'getLatestMessages');

            sinon.stub(data.events, 'getByTitle').returns(Promise.resolve(eventObj));

            return controller.getEventByTitle(req, res)
                .then(() => {
                    sinon.assert.calledWith(spy, eventObj.title);
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

    describe('updateEvent', () => {
        beforeEach(() => {
            result = {
                isEmpty: function () {
                    return true;
                },
                array: function () {
                    return [];
                },
            };

            req = require('../../req-res').getRequestMock({
                user: {
                    username: 'test',
                },
                body: {
                    date: '2017-07-30',
                    time: '16:00',
                    place: 'Sofia',
                    details: 'Sample'
                },
                params: {
                    title: 'test event'
                },
                assert: function () {
                    return this;
                },
                isDate: function (pass) {
                    return this;
                },
                notEmpty: function () {
                    return this;
                },
                getValidationResult: function () {
                    return new Promise((resolve, rej) => {
                        resolve(result);
                    });
                },
            });
        });

        it('should redirect to /login if no user is logged in', () => {
            req.user = undefined;

            const spy = sinon.spy(res, 'redirect');
            const route = '/login';

            controller.updateEvent(req, res);

            sinon.assert.calledWith(spy, route);
        });

        it('should call response status 400 and render view with errors if validation does not pass', () => {
            const spy = sinon.spy(res, 'status');

            sinon.stub(result, 'isEmpty').returns(false);

            return controller.updateEvent(req, res)
                .then(() => {
                    sinon.assert.calledWith(spy, 400);

                    expect(res.context).to.deep.equal({
                        errors: result.array(),
                    });

                    expect(res.viewName).to.be.equal('errors/all');
                });
        });

        it('should redirect to /error if event with that title is not found', () => {
            const spy = sinon.spy(res, 'redirect');
            const route = '/error';

            sinon.stub(data.events, 'getByTitle').returns(Promise.resolve(null));

            return controller.updateEvent(req, res)
                .then(() => {
                    sinon.assert.calledWith(spy, route);
                });
        });

        it('should call update of events, updateEvent of users and updateEvent of categories, and response status 200', () => {
            const eventsSpy = sinon.spy(data.events, 'update');
            const usersSpy = sinon.spy(data.users, 'updateEvent');
            const catSpy = sinon.spy(data.categories, 'updateEvent');
            const responseSpy = sinon.spy(res, 'status');

            sinon.stub(data.events, 'getByTitle').returns(Promise.resolve(eventObj));

            return controller.updateEvent(req, res)
                .then(() => {
                    sinon.assert.calledOnce(eventsSpy);
                    
                    sinon.assert.calledOnce(usersSpy);

                    sinon.assert.called(catSpy);

                    sinon.assert.calledWith(responseSpy, 200);
                });
        });
    });

    describe('deleteEvent', () => {
        beforeEach(() => {
            req = require('../../req-res').getRequestMock({
                user: {
                    username: 'test',
                },
                params: {
                    title: 'Event test',
                },
            });
        });

        it('should redirect to /login if no user is logged in', () => {
            req.user = undefined;

            const spy = sinon.spy(res, 'redirect');
            const route = '/login';

            controller.deleteEvent(req, res);

            sinon.assert.calledWith(spy, route);
        });

        it('should redirect to /error if event with that title is not found', () => {
            const spy = sinon.spy(res, 'redirect');
            const route = '/error';

            sinon.stub(data.events, 'getByTitle').returns(Promise.resolve(null));

            return controller.deleteEvent(req, res)
                .then(() => {
                    sinon.assert.calledWith(spy, route);
                });
        });

        it("should redirect to /error if a user is trying to delete someone else's event", () => {
            const spy = sinon.spy(res, 'redirect');
            const route = '/error';

            sinon.stub(data.events, 'getByTitle').returns(Promise.resolve(eventObj));
            req.user.username = 'someone';

            return controller.deleteEvent(req, res)
                .then(() => {
                    sinon.assert.calledWith(spy, route);
                });
        });

        it('should successfully delete the event from all collections and call status 200', () => {
            const eventsSpy = sinon.spy(data.events, 'remove');
            const chatsSpy = sinon.spy(data.chats, 'removeChatRoom');
            const usersSpy = sinon.spy(data.users, 'removeEvent');
            const catSpy = sinon.spy(data.categories, 'removeEvent');
            const responseSpy = sinon.spy(res, 'status');

            sinon.stub(data.events, 'getByTitle').returns(Promise.resolve(eventObj));

            return controller.deleteEvent(req, res)
                .then(() => {
                    sinon.assert.calledWith(eventsSpy, req.params.title);

                    sinon.assert.calledWith(chatsSpy, req.params.title);

                    sinon.assert.calledWith(usersSpy, req.user.username, req.params.title);

                    sinon.assert.called(catSpy);

                    sinon.assert.calledWith(responseSpy, 200);
                });
        });
    });

    describe('searchEvent', () => {
        beforeEach(() => {
            req = require('../../req-res').getRequestMock({
                query: {
                    name: 'pattern',
                    isPartial: true,
                },
            });
        });

        it(`should render partials/events view with context if isPartial query parameter is true and events are found`, () => {
            const events = [eventObj, eventObj];
                
            return controller.searchEvent(req, res)
                    .then(() => {
                        expect(res.context).to.be.deep.equal({
                            events: events,
                        });

                        expect(res.viewName).to.be.equal('partials/events');
            });
        });

        it(`should render partials/events view without context if isPartial query parameter is true and events are not found`, () => {                
            sinon.stub(data.events, 'getByTitlePattern').returns(Promise.resolve([]));
            
            return controller.searchEvent(req, res)
                    .then(() => {
                        expect(res.context).to.be.undefined;

                        expect(res.viewName).to.be.equal('partials/events');
            });
        });

        it(`should render search/search view if isPartial query parameter is not true`, () => {
            req.query.isPartial = false;            
            const events = [eventObj, eventObj];

            return controller.searchEvent(req, res)
                .then(() => {
                    expect(res.context).to.be.deep.equal({
                        title: req.query.name,
                        events: events,
                    });

                    expect(res.viewName).to.be.equal('search/search');
            });
        });
    });
});
