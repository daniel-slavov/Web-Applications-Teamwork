module.exports = (data, passport) => {
    return {
        getLogin: (req, res) => {
            if (req.user) {
                return res.redirect('/');
            }

            return res.render('login');
        },
        postLogin: (req, res) => {

        },
        getSignup: (req, res) => {
            if (req.user) {
                return res.redirect('/');
            }

            return res.render('signup');
        },
        postSignup: (req, res) => {
            if (req.user) {
                return res.redirect('/');
            }

            const user = req.body;

            return data.users.getUser(user.username)
                .then((existingUser) => {
                    if (existingUser !== null) {
                        return res.redirect('/signup');
                    }

                    user.avatar = 'photo.jpg';
                    user.events = [];

                    data.users.create(user);

                    return res.redirect('/login');
                });
        },
        logout: (req, res) => {
            req.logout();
            return res.redirect('/');
        },
        getUserProfile: (req, res) => {
            if (!req.user) {
                return res.redirect('/');
            }

            const username = req.params.username;
            if (username !== req.user.username) {
                return res.redirect('/');
            }

            return data.users.getUser(username)
                .then((user) => {
                    return res.render('users/profile', {
                        context: user,
                    });
                });
        },
        getUpdateUserProfile: (req, res) => {

        },
        postUpdateUserProfile: (req, res) => {

        },
        getUserEvents: (req, res) => {
            if (!req.user) {
                return res.redirect('/');
            }

            const username = req.params.username;
            if (username !== req.user.username) {
                return res.redirect('/');
            }

            return data.users.getEvents(username)
                .then((events) => {
                    return res.json(events);
                });
        },
    };
};
