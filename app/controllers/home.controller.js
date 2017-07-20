module.exports = (data) => {
    return {
        index: (req, res) => {
            return data.events.getUpcoming()
                .then((events) => {
                    res.render('home', {
                        user: req.user,
                        events: events,
                     });
                });
        },

        search: (req, res) => {
            return res.render('search/search');
        },
    };
};

