const request = require('supertest');

describe('Users routes: ', () => {
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
        })
    );

    describe('POST /signup', () => {
        it('expect to return 302 (OK)', (done) => {
            request(app)
                .post('/signup')
                .send(user)
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

    describe('POST /login', () => {
        it('expect to return 302 (Found)', (done) => {
            request(app)
                .post('/login')
                .send({ username: user.username, password: user.password })
                .expect(302)
                .expect('Location', '/')
                .end((error, res) => {
                    if (error) {
                        throw error;
                    }
                    cookie = res.headers['set-cookie'];
                    return done();
                });
        });
    });

    describe('PUT /users/:username', () => {
        it('expect to return 400 (Bad Request)', (done) => {
            request(app)
                .put(`/users/${user.username}`)
                .send({
                    username: 'test-user',
                    password: '123456',
                    passwordConfirm: '123456',
                    firstName: 'First',
                    lastName: 'Last',
                    email: 'test-userfwfwabv.bg',
                    age: '20',
                    avatar: 'http://www.infozonelive.com/styles/FLATBOOTS/theme/images/user4.png',
                })
                .set('cookie', cookie)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('expect to return 201 (Created)', (done) => {
            request(app)
                .put(`/users/${user.username}`)
                .send({
                    username: 'test-user',
                    password: '123456',
                    passwordConfirm: '123456',
                    firstName: 'First',
                    lastName: 'Last',
                    email: 'test-userfwfw@abv.bg',
                    age: '20',
                    avatar: 'http://www.infozonelive.com/styles/FLATBOOTS/theme/images/user4.png',
                })
                .set('cookie', cookie)
                .expect(201)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
    });
});
