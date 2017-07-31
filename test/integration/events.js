const request = require('supertest');
const { expect } = require('chai');

describe('Events routes: ', () => {
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
        events: [],
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
        it('expect to return 302 (Found) with location /login', (done) => {
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
        it('should return 302 (Found) and location /', (done) => {
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

    describe('POST /events/create', () => {
        it('expect to return 302 (Found) and redirect to new event page', (done) => {
            request(app)
                .post('/events/create')
                .send(event)
                .set('cookie', cookie)
                .expect(302)
                .expect('Location', `/events/${event.title}`)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    return done();
                });
        });
    });

    describe('PUT /api/events/:title', () => {
        it('expect to return 302 with location /error if event is not found', (done) => {
            request(app)
                .put(`/api/events/event`)
                .send({
                    title: 'event',
                    date: '2017-08-01',
                    time: '12:00:00',
                    place: 'Varna',
                    details: 'some details',
                    categories: category.name,
                })
                .set('cookie', cookie)
                .expect(302)
                .expect('Location', '/error')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('expect to return 400 (Bad Request) if data is not valid', (done) => {
            request(app)
                .put(`/api/events/${event.title}`)
                .send({
                    title: 'test-event',
                    date: '2017-08-01',
                    time: '12:00:00',
                    place: '',
                    details: 'some details',
                    categories: category.name,
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

        it('expect to return 200 (OK) if data is valid', (done) => {
            request(app)
                .put(`/api/events/${event.title}`)
                .send({
                    title: 'test-event',
                    date: '2017-08-01',
                    time: '12:00:00',
                    place: 'Varna',
                    details: 'some details',
                    categories: category.name,
                })
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

    describe('PUT /api/events/:title/upvote', () => {
        it('expect to return 302 with location /error if event is not found', (done) => {
            request(app)
                .put(`/api/events/${event.title}/upvote`)
                .send({
                    title: 'event',
                    votes: 1,
                })
                .set('cookie', cookie)
                .expect(302)
                .expect('Location', '/error')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('expect to return 200 (OK) if votes are updated', (done) => {
            request(app)
                .put(`/api/events/${event.title}/upvote`)
                .send({
                    title: 'test-event',
                    votes: 1,
                })
                .set('cookie', cookie)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    expect(res.body.votes).to.be.eq(2);

                    return done();
                });
        });
    });

    describe('DELETE /api/events/:title', () => {
        it('expect to return 200 (OK) if event is deleted', (done) => {
            request(app)
                .delete(`/api/events/${event.title}`)
                .set('cookie', cookie)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });

        it('expect to return 302 with location /error if event is not found', (done) => {
            request(app)
                .delete(`/api/events/event`)
                .set('cookie', cookie)
                .expect(302)
                .expect('Location', '/error')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
    });
});
