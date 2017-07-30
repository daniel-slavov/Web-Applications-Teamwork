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
                console.log('1');
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
                console.log('2');
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
    );

    // afterEach(() => cleanUp(config.connectionString));

    describe('GET: ', () => {
        it('- load profile page', (done) => {
            request(app)
                .get(`/users/${user.username}`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it(`- get user's events`, (done) => {
            request(app)
                .get(`/api/users/${user.username}/events`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
    });

    describe('PUT: ', () => {
        beforeEach(() => signInUser(agent, user));

        it('- update user details', () => {
            // request(app)
                agent.put(`/users/${user.username}`)
                .send({
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                })
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    console.log(res);
                    return done();
                });
        });
    });
});
