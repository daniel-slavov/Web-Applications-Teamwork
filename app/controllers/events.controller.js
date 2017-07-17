module.exports = (data) => {
    return {
        getCreateEvent: (req, res) => {
            if (!req.user) {
                return res.redirect('/');
            }

            return res.redirect('create.event');
        },
        postCreateEvent: () => {

        },
        getEventById: () => {

        },
        getAllCategories: () => {

        },
        getAllEventsByCategory: () => {

        },
        getCalendar: () => {

        },
        getAllEventsByDate: () => {

        },
    };
};
