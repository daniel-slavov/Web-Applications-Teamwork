const { expect } = require('chai');
const sinon = require('sinon');

const CategoriesData = require('../../../data/categories.data');

describe('CategoriesData', () => {
    const db = {
        collection: () => { },
    };

    let categories = [];
    let data = null;

    const events = [{ title: 'Some event' }];
    const toArray = () => {
        return Promise.resolve(events);
    };
    const find = (user) => {
        return {
            toArray,
        };
    };
    const findOne = (categoryName) => {
        return Promise.resolve(categories[0]);
    };
    const newEvent = { title: 'new event' };

    let update = (userObj) => {
        categories[0].events.push(newEvent);
    };


    beforeEach(() => {
        categories = [{
            _id: '596b1d2cfef2e82704d679e4',
            name: 'Fun',
            events: events,
        },
        {
            _id: '596b2a0ae6239d22044adb29',
            name: 'Cinema',
            events: events,
        }];

        sinon.stub(db, 'collection')
            .callsFake(() => {
                return { findOne, find, update };
            });

        data = new CategoriesData(db);
    });

    afterEach(() => {
        db.collection.restore();
    });

    describe('getAll()', () => {
        it('expect to return all categories', () => {
            return data.getAll()
                .then((found) => {
                    expect(found).to.deep.equal(events);
                });
        });
    });

    describe('getEventsByCategory()', () => {
        it('expect to return events of given category', () => {
            return data.getEventsByCategory('Fun')
                .then((foundEvents) => {
                    expect(foundEvents).to.deep.equal(events);
                });
        });
    });

    describe('addEventToCategory()', () => {
        it('expect add new event to categories\' list of events', () => {
            data.addEventToCategory('Fun', newEvent);
            expect(categories[0].events).to.deep.include(newEvent);
        });
    });


    describe('updateEvent()', () => {
        before(() => {
            update = () => {
                categories[0].events[0].title = 'new title';
                categories[0].events[0].date = 'new date';
                categories[0].events[0].time = 'new time';
                categories[0].events[0].place = 'new place';
                categories[0].events[0].details = 'new details';
                categories[0].events[0].likes = 'new likes';
                categories[0].events[0].photo = 'new photo';
            };
        });

        it('expect to update event from given category', () => {
            data.updateEvent('Fun', 'new title', 'new date', 'new time',
                'new place', 'new details', 'new likes', 'new photo');

            expect(categories[0].events).to.deep.include({
                title: 'new title',
                date: 'new date',
                time: 'new time',
                place: 'new place',
                details: 'new details',
                likes: 'new likes',
                photo: 'new photo',
            });
        });
    });

    describe('removeEvent()', () => {
        before(() => {
            update = () => {
                let index = 0;
                for (let i = 0; i < categories[0].events.length; i++) {
                    if (categories[0].events[i].title === 'Some event') {
                        index = i;
                        break;
                    }
                }

                categories[0].events.slice(index, index + 1);
            };
        });

        it('expect to detele event from given category', () => {
            data.removeEvent('user', 'new title', 'new date', 'new time',
                'new place', 'new details', 'new likes', 'new photo');

            expect(categories[0].events).to.not.deep.include({
                title: 'Some event',
            });
        });
    });
});
