const request = require('supertest');
const { cleanUp } = require('../shared/db.utils');

describe('Categories:', () => {
    const config = {
        connectionString: 'mongodb://localhost/Events-test',
        port: 3002,
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
        categories: [],
    };

    let app = null;

    beforeEach(() => Promise.resolve()
        .then(() => require('../../db').init(config.connectionString))
        .then((db) => require('../../data').init(db))
        .then((data) => {
            data.categories.create({ name: 'test-category' });
            data.categories.addEventToCategory('test-category', event);
            return require('../../app').init(data);
        })
        .then((app_) => {
            app = app_;
        })
    );

    after(() => {
        return Promise.resolve()
            .then(() => require('../../db').init(config.connectionString))
            .then((db) => db.dropDatabase());
    });

    it('expect to load categories page (200)', (done) => {
        request(app)
            .get('/categories')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('expect to load single category page (200)', (done) => {
        request(app)
            .get(`/categories/${category.name}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('expect to load partial category page (200)', (done) => {
        request(app)
            .get(`/api/categories/${category.name}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});
