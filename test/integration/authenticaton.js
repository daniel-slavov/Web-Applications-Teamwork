const request = require('supertest');
const { expect } = require('chai');

const init = require('../../app/app');

describe('Authentication: ', () => {
    const config = {
        connectionString: 'mongodb://localhost/Events',
        port: 3003,
    };

    const app = require('../../db').init(config.connectionString)
        .then((db) => {
            return require('../../data').init(db);
        })
        .then((data) => {
            return require('../../app').init(data);
        })
        .then((app_) => {
                return app_.listen(config.port);
            });

    console.log(app);

    it('Signup GET', (done) => {
        request(app)
            .get('/signup')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                return done();
            });
    });
});
