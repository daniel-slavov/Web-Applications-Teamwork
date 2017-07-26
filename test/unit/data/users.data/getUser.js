const { expect } = require('chai');
const sinon = require('sinon');

const UsersData = require('../../../../data/users.data');

describe('UsersData.getUserByPattern()', () => {
    const db = {
        collection: () => { },
    };

    let users = [];
    const validator = null;
    let data = null;

    const toArray = () => {
        return Promise.resolve(users);
    };

    const find = (user) => {
        return {
            toArray,
        };
    };

    describe('when there are users in db', () => {
        beforeEach(() => {
            users = [{
                username: 'user',
                password: '123456',
            },
            {
                username: 'user1',
                password: '234567',
            }];

            sinon.stub(db, 'collection')
                .callsFake(() => {
                    return { find };
                });

            data = new UsersData(db, validator);
        });

        afterEach(() => {
            db.collection.restore();
        });

        it('expect to return users if users were found', () => {
            return data.getUserByPattern('us')
                .then((user) => {
                    expect(user).to.deep.equal(users);
                });
        });
        it('expect to return null if users were not found', () => {
            return data.getUserByPattern('te')
                .then((user) => {
                    expect(user).to.deep.equal(users);
                });
        });
    });
});
