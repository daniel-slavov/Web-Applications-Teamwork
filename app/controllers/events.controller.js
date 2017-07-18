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
                    if (result.length > 0) {
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

            return data.events.getByTitle(title)
                .then((event) => {
                    return res.json(event);
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
    };
};
