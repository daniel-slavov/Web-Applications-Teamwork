const request = require('supertest');
const { cleanUp } = require('../shared/db.utils');

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
                resolve(res);
            });
    });
};

describe('Categories: ', () => {
    const config = {
        connectionString: 'mongodb://localhost/Events-test',
        port: 3002,
    };

    const category = {
        name: 'test-category',
        event: [],
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
        .then(() => createCategory(app, category))
    );

    afterEach(() => cleanUp(config.connectionString));

    it('- load categories page', (done) => {
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

    // it('- load single category page', (done) => {
    //     agent.get(`/categories/${category.name}`)
    //         .expect(200)
    //         .end((err, res) => {
    //             // console.log(res);
    //             if (err) {
    //                 return done(err);
    //             }
    //             return done();
    //         });
    // });

    // it('- load partial category page', (done) => {
    //     request(app)
    //         .get(`api/categories/${category.name}`)
    //         .expect(200)
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             }
    //             return done();
    //         });
    // });
});
