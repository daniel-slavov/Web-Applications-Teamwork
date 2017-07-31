const request = require('supertest');

describe('Search: ', () => {
    const config = {
        connectionString: 'mongodb://localhost/Events-test',
        port: 3002,
    };

    let app = null;

    beforeEach(() => Promise.resolve()
        .then(() => require('../../db').init(config.connectionString))
        .then((db) => require('../../data').init(db))
        .then((data) => require('../../app').init(data))
        .then((app_) => {
            app = app_;
        })
    );

    it('expect to load search page (200)', (done) => {
        request(app)
            .get('/search')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('expect to load search events (200)', (done) => {
        request(app)
            .get('/search/events')
            .query({
                name: 'test',
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('expect to load search users (200)', (done) => {
        request(app)
            .get('/search/users')
            .query({
                name: 'test',
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});
