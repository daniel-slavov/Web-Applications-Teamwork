const request = require('supertest');
const { expect, should, assert } = require('chai');
const { cleanUp } = require('../shared/db.utils');

const init = require('../../app/app');
// const signUpUser = (agent, user) => {
//     return new Promise((resolve, reject) => {
//         agent.post('/signup')
//             .type('form')
//             .send({
//                 username: user.username,
//                 password: user.password,
//                 passwordConfirm: user.passwordConfirm,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 email: user.email,
//                 age: user.age,
//                 avatar: user.avatar,
//             })
//             .end((err, res) => {
//                 // console.log('1');
//                 resolve(res);
//             });
//     });
// };

// const signInUser = (agent, user) => {
//     return new Promise((resolve, reject) => {
//         agent.post('/login')
//             .type('form')
//             .send({
//                 username: user.username,
//                 password: user.password,
//             })
//             .end((err, res) => {
//                 // console.log('2');
//                 resolve(res);
//             });
//     });
// };

// const createCategory = (app, category) => {
//     return new Promise((resolve, reject) => {
//         request(app)
//             .post('/categories/create')
//             .type('form')
//             .send({
//                 name: category.name,
//                 event: category.event,
//             })
//             .end((err, res) => {
//                 // console.log('3');
//                 // console.log(err);
//                 resolve(res);
//             });
//     });
// };

// const createEvent = (agent, event, user) => {
//     // console.log('test method create event');
//     return new Promise((resolve, reject) => {
//         agent.post('/events/create')
//             .type('form')
//             .set('user', {
//                 username: user.username,
//                 password: user.password,
//             }) // not sure about this
//             .send({
//                 title: event.title,
//                 date: event.date,
//                 time: event.time,
//                 place: event.place,
//                 details: event.details,
//                 categories: event.categories,
//                 user: { // maybe wrong
//                     username: user.username,
//                     password: user.password,
//                 },
//             })
//             .end((err, res) => {
//                 resolve(res);
//             });
//     });
// };

describe('Events looooook hererererere: ', () => {
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
    let cookie = null;

    after(() => {
        return Promise.resolve()
            .then(() => require('../../db').init(config.connectionString))
            .then((db) => db.dropDatabase());
    });

    beforeEach(() => Promise.resolve()
        .then(() => require('../../db').init(config.connectionString))
        .then((db) => require('../../data').init(db))
        .then((data) => require('../../app').init(data))
        .then((app_) => {
            app = app_;
            agent = request.agent(app_);
        })
        // .then(() => signUpUser(agent, user))
        // .then(() => signInUser(agent, user))
        // .then(() => createCategory(app, category))
        // .then(() => createEvent(agent, event, user))
    );

    // afterEach(() => cleanUp(config.connectionString));
    describe('POST /signup', () => {
        it('expect to return 302 (OK)', (done) => {
            request(app)
                .post('/signup')
                .send({
                    username: 'test-user',
                    password: '123456',
                    passwordConfirm: '123456',
                    firstName: 'First',
                    lastName: 'Last',
                    email: 'test-user@mail.com',
                    age: '20',
                    avatar: 'http://www.infozonelive.com/styles/FLATBOOTS/theme/images/user4.png',
                })
                .expect(302)
                .expect('Location', '/login')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
    });

    describe('GET: ', () => {
        // it('- load all events page', (done) => {
        //     request(app)
        //         .get('/events')
        //         .expect(200)
        //         .end((err, res) => {
        //             if (err) {
        //                 return done(err);
        //             }
        //             return done();
        //         });
        // });

        it('expect to return 302 (Found)', (done) => {
            request(app)
                .post('/login')
                // .set('Accept', 'application/json')
                .send({ username: user.username, password: user.password })
                .expect(302)
                .expect('Location', '/')
                .end((error, res) => {
                    if (error) {
                        throw error;
                    }
                    cookie = res.headers['set-cookie'];
                    console.log('sth');
                    return done();
                });
        });

        it('- load create events page', (done) => {
            request(app)
                .get(`/events/create`)
                .set('cookie', cookie)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
    });
});
