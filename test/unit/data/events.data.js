const { expect } = require('chai');
const sinon = require('sinon');

const EventsData = require('../../../data/events.data');
const Event = require('../../../models/event');

describe('EventsData', () => {
    const db = {
        collection: () => { },
    };

    let events = [];
    const isValidEvent = () => {
        return true;
    };
    const validator = {
        isValidEvent,
    };
    let data = null;

    const toArray = () => {
        return Promise.resolve(events);
    };
    const find = (title) => {
        return {
            toArray,
        };
    };
    const aggregate = () => {
        return {
            toArray,
        };
    };
    const insert = (newEvent) => {
        events.push(new Event(newEvent));
    };

    const findOne = (pattern) => {
        for (let i = 0; i < events.length; i++) {
            if (events[i].title.match(pattern)) {
                return Promise.resolve(events[0]);
            }
        }

        return null;
    };
    const newEvent = { title: 'New event' };
    let update = (eventObj) => {
    };

    const remove = (title) => {
        events.pop();
    };

    const categories = [{ name: 'Fun', events: [] }]
    beforeEach(() => {
        events = [{
            _id: '596b1d2cfef2e82704d679e4',
            title: 'Event',
            place: 'Sofia',
            date: '15.08.18',
            time: '15:00',
            likes: '10',
            user: 'user',
            details: 'details',
            photo: 'img',
            categories: categories,
        }];

        sinon.stub(db, 'collection')
            .callsFake(() => {
                return { aggregate, findOne, find, insert, update, remove };
            });
        sinon.stub(validator, 'isValidEvent')
            .callsFake(() => {
                return isValidEvent;
            });

        data = new EventsData(db, validator);
    });

    afterEach(() => {
        db.collection.restore();
        validator.isValidEvent.restore();
    });

    describe('getByTitlePattern()', () => {
        it('expect to return events with such title', () => {
            return data.getByTitlePattern('ev')
                .then((found) => {
                    expect(found).to.includes(events[0]);
                });
        });
    });

    describe('getByTitle()', () => {
        it('expect to return event if event was found', () => {
            return data.getByTitle('event')
                .then((found) => {
                    expect(found).to.deep.equal(events[0]);
                });
        });

        it('expect to return null if event was not found', () => {
            const found = data.getByTitle('test');

            expect(found).to.be.empty;
        });
    });

    describe('getById()', () => {
        it('expect to return event if user was found', () => {
            return data.getById('596b1d2cfef2e82704d679e4')
                .then((found) => {
                    expect(found).to.deep.equal(events[0]);
                });
        });

        it('expect to return empty object if event was not found', () => {
            const found = data.getById('59765842ec26b73928903cb8');
            expect(found).to.be.empty;
        });
    });

    describe('getByDate()', () => {
        it('expect to return events on given date', () => {
            return data.getByDate('15.08.18')
                .then((found) => {
                    expect(found).to.includes(events[0]);
                });
        });
    });

    describe('create()', () => {
        it('expect to create event if isValidEvent returns true', () => {
            const eventToCreate = {
                _id: '596b1d2cfef2e82704d679e4',
                title: 'Event',
                place: 'Sofia',
                date: '15.08.18',
                time: '15:00',
                likes: '10',
                user: 'user',
                details: 'details',
                photo: 'img',
                categories: categories,
            };

            data.create(eventToCreate);
            expect(events).to.deep.include(new Event(eventToCreate));
        });

        it('expect not to create event if isValidEvent returns false', () => {
            validator.isValidEvent.restore();
            sinon.stub(validator, 'isValidEvent')
                .callsFake(() => {
                    return false;
                });

            const eventToCreate = {
                _id: '596b1c2cfef2e82704d679e4',
                title: 'Not created',
                place: 'Sofia',
                date: '15.08.18',
                time: '15:00',
                likes: '10',
                user: 'user',
                details: 'details',
                photo: 'img',
                categories: categories,
            };
            data.create(eventToCreate);

            expect(events).to.not.deep.include(new Event(eventToCreate));
        });
    });

    describe('getUpcoming()', () => {
        it('expect to return upcoming events', () => {
            data.getUpcoming()
                .then((foundEvents) => {
                    expect(foundEvents).to.be.deep.equal(events);
                });
        });
    });

    describe('update()', () => {
        before(() => {
            update = (eventTitle, date, time, place, details, photo) => {
                events[0].date = 'new date';
                events[0].time = 'new time';
                events[0].place = 'new place';
                events[0].details = 'new details';
                events[0].likes = 'new likes';
                events[0].photo = 'new photo';
                events[0].user = 'user';
            };
        });

        it('expect to update event', () => {
            data.update('Event', 'new date', 'new time',
                'new place', 'new details', 'new likes', 'new photo');
            expect(events[0]).to.deep.equal({
                title: 'Event',
                date: 'new date',
                time: 'new time',
                place: 'new place',
                details: 'new details',
                likes: 'new likes',
                photo: 'new photo',
                user: 'user',
                _id: '596b1d2cfef2e82704d679e4',
                categories: categories,
            });
        });
    });

    describe('updateLikes()', () => {
        before(() => {
            update = (eventTitle, likes) => {
                events[0].likes = 15;
            };
        });

        it('expect to update likes of event', () => {
            data.updateLikes('Event', 15);
            expect(events[0].likes).to.equal(15);
        });
    });

    describe('updatePhoto()', () => {
        before(() => {
            update = (eventTitle, photo) => {
                events[0].photo = 'photo photo';
            };
        });

        it('expect to update photo of event', () => {
            data.updatePhoto('Event', 'photo photo');
            expect(events[0].photo).to.equal('photo photo');
        });
    });

    describe('remove()', () => {
        it('expect to delete event', () => {
            data.remove('Event');

            expect(events).to.has.length(0);
        });
    });
});
