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
                // console.log('1');
                resolve(res);
            });
    });
};

const signInUser = (agent, user) => {
    return new Promise((resolve, reject) => {
        agent.post('/signin')
            .type('form')
            .send({
                username: user.username,
                password: user.password,
            })
            .end((err, res) => {
                // console.log('2');
                resolve(res);
            });
    });
};

const createCategory = (app, category) => {
    return new Promise((resolve, reject) => {
        request(app)
            .post('/categories/create')
            .type('form')
            .send({
                name: category.name,
                event: category.event,
            })
            .end((err, res) => {
                // console.log('3');
                // console.log(err);
                resolve(res);
            });
    });
};

const createEvent = (agent, event, user) => {
    // console.log('test method create event');
    return new Promise((resolve, reject) => {
        agent.post('/events/create')
            .type('form')
            .set('user', {
                username: user.username,
                password: user.password,
             }) // not sure about this
            .send({
                title: event.title,
                date: event.date,
                time: event.time,
                place: event.place,
                details: event.details,
                categories: event.categories,
                user: { // maybe wrong
                    username: user.username,
                    password: user.password,
                },
            })
            .end((err, res) => {
                resolve(res);
            });
    });
};

describe('Events: ', () => {
    const config = {
        connectionString: 'mongodb://localhost/Events-test',
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
        event: [],
    };

    const event = {
        title: 'test-event',
        date: '2017-08-01',
        time: '12:00:00',
        place: 'Sofia',
        details: 'some details',
        categories: category.name,
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
        .then(() => createCategory(app, category))
        .then(() => createEvent(agent, event, user))
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
            request(app).post('/signin')
            .type('form')
            .send({
                username: user.username,
                password: user.password,
            })
            .end((err, res) => {
                // console.log('2');
                return request(app).get('/events/create')
                            .expect(200)
                            .end((er, re) => {
                                if (er) {
                                    // console.log(err);
                                    return done(er);
                                }
                                // console.log(res);
                                return done();
                            });
            });
        });

        it('- load single event page', (done) => {
            request(app)
                .get(`/events/${event.title}`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    expect(res.header.location).to.contain('error');
                    return done();
                });
        });
    });

    // describe('POST: ', () => {
    //     it('- create new event', (done) => {
    //         agent.post('/events/create')
    //         .type('form')
    //         .send({
    //             title: event.title,
    //             date: event.date,
    //             time: event.time,
    //             place: event.place,
    //             details: event.details,
    //             categories: event.categories,
    //             user: {
    //                 username: user.username,
    //                 password: user.password,
    //             },
    //         })
    //         .end((err, res) => {
    //             done(res);
    //         });
    //     });
    // });

    // describe('PUT: ', () => {
    //     it('- create new event', (done) => {
    //         request(app)
    //             .post(`/api/events/${event.title}`)
    //             .expect(200)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 expect(res.header.location).to.contain('error');
    //                 return done();
    //             });
    //     });
    // });

    // describe('DELETE: ', (done) => {
    //     it('- delete an event', () => {
    //         request(app)
    //             .post(`/events/create`)
    //             .expect(200)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 expect(res.header.location).to.contain('error');
    //                 return done();
    //             });
    //     });
    // });
});
