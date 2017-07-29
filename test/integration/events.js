const request = require('supertest');
const { expect, should, assert } = require('chai');
const { cleanUp } = require('../shared/db.utils');

const init = require('../../app/app');

const signUpUser = (agent, user) => {
    return new Promise((resolve, reject) => {
        agent.post('/signup')
            .type('form')
            .send({
                username: user.username,
                password: user.password,
                passwordConfirm: user.passwordConfirm,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                avatar: user.avatar,
             })
            .end((err, res) => {
                resolve(res);
            });
    });
};

const signInUser = (agent, user) => {
    return new Promise((resolve, reject) => {
        agent.post('/signin')
            .type('form')
            .send(user)
            .end((err, res, req) => {
                resolve(res);
            });
    });
};

const createCategory = (agent, category) => {
    return new Promise((resolve, reject) => {
        agent.post('/categories/create')
            .type('form')
            .send({
                name: category.name,
                event: category.event,
            })
            .end((err, res) => {
                // console.log(res);
                resolve(res);
            });
    });
};

const createEvent = (agent, event) => {
    return new Promise((resolve, reject) => {
        agent.post('/events/create')
            .type('form')
            .send({
                title: event.title,
                date: event.date,
                time: event.time,
                place: event.place,
                details: event.details,
                categories: event.categories,
            })
            .end((err, res) => {
                resolve(res);
            });
    });
};

describe('Events: ', () => {
    const config = {
        connectionString: 'mongodb://localhost/Events',
        port: 3002,
    };

    const user = {
        username: 'test-user',
        password: '123456',
        passwordConfirm: '123456',
        firstName: 'First',
        lastName: 'Last',
        email: 'test-user@mail.com',
        age: '20',
        avatar: 'http://www.infozonelive.com/styles/FLATBOOTS/theme/images/user4.png',
    };

    const category = {
        name: 'test-category',
        event: '',
    };

    const event = {
        title: 'test-event',
        date: '2017-08-01',
        time: '12:00:00',
        place: 'Sofia',
        details: 'some details',
        categories: 'test',
    };

    let app = null;
    let agent = null;

    beforeEach(() => Promise.resolve()
        .then(() => require('../../db').init(config.connectionString))
        .then((db) => require('../../data').init(db))
        .then((data) => require('../../app').init(data))
        .then((app_) => {
            app = app_;
            agent = request.agent(app_);
        })
        .then(() => signUpUser(agent, user))
        .then(() => signInUser(agent, user))
        .then(() => createCategory(agent, category))
        .then(() => createEvent(agent, event))
    );

    // afterEach(() => cleanUp(config.connectionString));

    describe('GET: ', () => {
        it('- load all events page', (done) => {
            request(app)
                .get('/events')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('- load create events page', (done) => {
            request(app)
                .get('/events/create')
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        // console.log(err);
                        return done(err);
                    }
                    // console.log(res);
                    return done();
                });
        });

        it('- load single event page', (done) => {
            request(app)
                .get(`/events/${event.title}`)
                .expect(302)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    expect(res.header.location).to.contain('error');
                    return done();
                });
        });
    });
});
