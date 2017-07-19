module.exports = (data) => {
    return {
        getCreateEvent: (req, res) => {
            if (!req.user) {
                return res.redirect('/');
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
                return res.redirect('/');
            }

            const event = req.body;

            return data.events.getByTitle(event.title)
                .then((result) => {
                    if (result !== null) {
                        return res.redirect('/events/create');
                    }

                    event.likes = 0;
                    event.photo = 'photo.jpg';
                    event.user = req.user.username;

                    data.events.create(event);

                    if (typeof event.categories === 'string') {
                        const category = event.categories;
                        data.categories.addEventToCategory(category, event);
                    } else {
                        event.categories.forEach((category) => {
                            data.categories.addEventToCategory(category, event);
                        });
                    }

                    data.users.addEventToUser(event.user, event);

                    return res.redirect('/');
                });
        },
        getEventByTitle: (req, res) => {
            const title = req.params.title;

            let event;
            data.events.getByTitle(title)
                .then((eventInformation) => {
                    event = eventInformation;
                    return data.chats.getLatestMessages(event.title);
                })
                .then((messages) => {
                    return res.render('events/details', {
                        event: event, chat: messages });
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
        getAllEventsByCategory: (req, res) => {
            const category = req.params.name;

            return data.categories.getEventsByCategory(category)
                .then((events) => {
                    return res.json(events);
                });
        },
        getCalendar: () => {

        },
        getAllEventsByDate: (req, res) => {
            const date = req.params.date;

            return data.events.getByDate(date)
                .then((events) => {
                    return res.json(events);
                });
        },
        getUpdateEvent: (req, res) => {
            if (!req.user) {
                return res.redirect('/');
            }

            const title = req.params.title;

            return data.events.getByTitle(title)
                .then((event) => {
                    const user = event.user;

                    if (user !== req.user.username) {
                        return res.redirect('/');
                    }

                    return res.render('events/edit', {
                            context: event,
                        });
                });
        },
        postUpdateEvent: (req, res) => {
            if (!req.user) {
                return res.redirect('/');
            }

            const newEvent = req.body;
            const title = req.params.title;

            data.events.update(title, newEvent.date, newEvent.time,
                newEvent.place, newEvent.details, newEvent.photo);

            // IMPLEMENT - update event in user's collection

            return res.redirect('/api/events/' + title);
        },
        deleteEvent: (req, res) => {
            if (!req.user) {
                return res.redirect('/login');
            }

            const title = req.params.title;

            return data.events.getEventByTitle(title)
                .then((event) => {
                    if (event.user !== req.user.username) {
                        return res.redirect('/');
                    }

                    data.events.remove(title);

                    data.users.removeEvent(req.user.username, title);

                    return res.redirect(
                        '/users/' + req.user.username + 'my-events');
                });
        },
    };
};
