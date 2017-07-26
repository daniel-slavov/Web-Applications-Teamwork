module.exports = (data) => {
    return {
        getCreateEvent: (req, res) => {
            if (!req.user) {
                return res.redirect('/login');
            }

            return data.categories.getAll()
                .then((categories) => {
                    return res.render('events/create', {
                        categories: categories,
                    });
                });
        },
        postCreateEvent: (req, res) => {
            if (!req.user) {
                return res.redirect('/login');
            }

            req.assert('title',
                'Title must be at least 6 symbols.').len(6);
            req.assert('date', 'Date is required').isDate();
            req.assert('time', 'Time is required').notEmpty();
            req.assert('place', 'Place is required.').notEmpty();
            req.assert('categories', 'Category is required').notEmpty();

            const event = req.body;

            return req.getValidationResult()
                .then((result) => {
                    if (!result.isEmpty()) {
                        return data.categories.getAll()
                            .then((categories) => {
                                return res.render('events/create', {
                                    event: event,
                                    categories: categories,
                                    errors: result.array(),
                                });
                            });
                    }

                    return data.events.getByTitle(event.title)
                        .then((existing) => {
                            if (existing !== null) {
                                const errors = [];
                                errors.push({ msg: `Event with that 
                                    title already exists.` });

                                return data.categories.getAll()
                                    .then((categories) => {
                                        return res.render('events/create', {
                                            event: event,
                                            categories: categories,
                                            errors: errors,
                                        });
                                    });
                            }

                            event.likes = 0;
                            event.photo = 'http://s3.amazonaws.com/churchplantmedia-cms/grace_community_church_tucson_az/events_medium.jpg';
                            event.user = req.user.username;

                            data.events.create(event);

                            if (typeof event.categories === 'string') {
                                const category = event.categories;
                                data.categories
                                    .addEventToCategory(category, event);
                            } else {
                                event.categories.forEach((category) => {
                                    data.categories
                                        .addEventToCategory(category, event);
                                });
                            }

                            data.users.addEventToUser(event.user, event);

                            return res.redirect('/events/' + event.title);
                        });
                });
        },
        getEventByTitle: (req, res) => {
            const title = req.params.title;

            let event;
            data.events.getByTitle(title)
                .then((eventInformation) => {
                    if (eventInformation === null) {
                        throw new Error('No events were found');
                    }

                    event = eventInformation;
                    return data.chats.getLatestMessages(event.title);
                })
                .then((messages) => {
                    return res.render('events/details', {
                        event: event,
                        chat: messages,
                        user: req.user,
                    });
                })
                .catch((err) => {
                    return res.redirect('/error');
                });
        },
        getAllCategories: (req, res) => {
            return data.categories.getAll()
                .then((categories) => {
                    return res.render('categories/all', {
                        categories: categories,
                    });
                });
        },
        getEventsByCategory: (req, res) => {
            const category = req.params.name;

            return data.categories.getEventsByCategory(category)
                .then((events) => {
                    if (events.length === 0) {
                        return res.render('partials/events');
                    }

                    events = events.slice(0, 4);
                    return res.render('partials/events', {
                        events: events,
                    });
                });
        },
        getAllEventsByCategory: (req, res) => {
            const category = req.params.name;

            return data.categories.getEventsByCategory(category)
                .then((events) => {
                    if (events.length === 0) {
                        return res.render('events/events', {
                            title: category,
                        });
                    }

                    return res.render('events/events', {
                        title: category,
                        events: events,
                    });
                });
        },
        getCalendar: (req, res) => {
            return res.render('calendar/calendar');
        },
        getAllEventsByDate: (req, res) => {
            const date = req.params.date;

            return data.events.getByDate(date)
                .then((events) => {
                    if (events.length === 0) {
                        return res.render('partials/events');
                    }

                    return res.render('partials/events', {
                        events: events,
                    });
                });
        },
        updateEvent: (req, res) => {
            if (!req.user) {
                return res.redirect('/login');
            }

            req.assert('date', 'Date is required').isDate();
            req.assert('time', 'Time is required').notEmpty();
            req.assert('place', 'Place is required.').notEmpty();

            const newEvent = req.body;
            const title = req.params.title;

            return req.getValidationResult()
                .then((result) => {
                    if (!result.isEmpty()) {
                        // There are errors in validation
                        // return errors object and status code

                        return res.status(400).render('errors/all', {
                            errors: result.array(),
                        });
                    }

                    return data.events.getByTitle(title)
                        .then((event) => {
                            if (event === null) {
                                return res.redirect('/error');
                            }

                            if (event.user !== req.user.username) {
                                return res.redirect('/error');
                            }

                            data.events.update(title, newEvent.date,
                                newEvent.time, newEvent.place,
                                newEvent.details, newEvent.photo);

                            data.users.updateEvent(
                                event.user, title, newEvent.date,
                                newEvent.time, newEvent.place, newEvent.details,
                                event.categories, event.likes, newEvent.photo);
                            
                            if (typeof event.categories === 'string') {
                                const category = event.categories;
                                data.categories.updateEvent(
                                    category, title, newEvent.date,
                                    newEvent.time, newEvent.place,
                                    newEvent.details, event.categories,
                                    event.likes, newEvent.photo, event.user);
                            } else {
                                event.categories.forEach((category) => {
                                    data.categories.updateEvent(category, title,
                                        newEvent.date, newEvent.time,
                                        newEvent.place, newEvent.details,
                                        event.categories, event.likes,
                                        newEvent.photo, event.user);
                                });
                            }

                            console.log('UPDATE');
                            return res.status(200);
                        });
                });
        },
        deleteEvent: (req, res) => {
            if (!req.user) {
                return res.redirect('/login');
            }

            const title = req.params.title;

            return data.events.getByTitle(title)
                .then((event) => {
                    if (event === null) {
                        return res.redirect('/error');
                    }

                    if (event.user !== req.user.username) {
                        return res.redirect('/error');
                    }

                    data.events.remove(title);

                    data.users.removeEvent(req.user.username, title);

                    if (typeof event.categories === 'string') {
                        const category = event.categories;
                        data.categories.removeEvent(category, event);
                    } else {
                        event.categories.forEach((category) => {
                            data.categories.removeEvent(category, event);
                        });
                    }

                    return res.status(200);
                });
        },

        searchEvent: (req, res) => {
            const pattern = req.query.name;
            const partial = req.query.isPartial;

            if (partial) {
                return data.events.getByTitlePattern(pattern)
                .then((events) => {
                    if (events.length === 0) {
                        return res.render('partials/events');
                    }

                    return res.render('partials/events', {
                        events: events,
                    });
                });
            }

            return data.events.getByTitlePattern(pattern)
                .then((events) => {
                    return res.render('search/search', {
                        title: pattern,
                        events: events,
                    });
                });
        },
    };
};
