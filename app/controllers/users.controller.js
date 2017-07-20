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
            if (!req.user) {
                return res.redirect('/');
            }

            const username = req.user.username;

            return data.users.getUser(username)
                .then((user) => {
                    return res.render('users/edit', {
                        context: user,
                    });
                });
        },
        postUpdateUserProfile: (req, res) => {
            if (!req.user) {
                return res.redirect('/');
            }

            const newUser = req.body;
            newUser.username = req.user.username;

            data.users.updateProfile(newUser.username, newUser.firstName,
                newUser.lastName, newUser.age, newUser.email, newUser.avatar);

            return res.redirect('/users/' + newUser.username);
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
        searchUser: (req, res) => {
            const pattern = req.query.pattern;

            return data.users.getUserByPattern(pattern)
                .then((users) => {
                    return res.json(users);
                });
        },
    };
};
