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
    };
};

