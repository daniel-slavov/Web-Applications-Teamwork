const request = require('supertest');

describe('Calendar: ', () => {
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

    it('- load calendar page', (done) => {
        request(app)
            .get('/events-calendar')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('- load events for a date', (done) => {
        request(app)
            .get('/api/events-calendar/2017-08-01')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});
