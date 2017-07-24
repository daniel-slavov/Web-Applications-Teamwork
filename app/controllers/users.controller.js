module.exports = (data, passport) => {
    return {
        getLogin: (req, res) => {
            if (req.user) {
                return res.redirect('/');
            }

            return res.render('login');
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

            req.assert('username',
                'Username must be between 6 and 25 symbols.').len(6, 25);
            req.assert('password',
                'Passsword must be at least 6 symbols.').len(6);
            req.assert('passwordConfirm', 'Passwords do not match')
                .equals(req.body.password);
            req.assert('email', 'Email is not valid').isEmail();

            const user = req.body;

            return req.getValidationResult()
                .then((result) => {
                    if (!result.isEmpty()) {
                        return res.status(400).render('signup', {
                            context: user,
                            errors: result.array(),
                        });
                    }

                    return data.users.getUser(user.username)
                        .then((existingUser) => {
                            if (existingUser !== null) {
                                const errors = [];
                                errors.push({ msg: `User with that 
                                    username already exists.` });

                                return res.render('signup', {
                                    context: user,
                                    errors: errors,
                                });
                            }

                            user.avatar = 'photo.jpg';
                            user.events = [];

                            data.users.create(user);

                            return res.redirect('/login');
                        });
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
            // if (username !== req.user.username) {
            //     return res.redirect('/');
            // }

            return data.users.getUser(username)
                .then((user) => {
                    return res.render('users/profile', {
                        context: user,
                        user: req.user.username,
                    });
                });
        },
        updateUserProfile: (req, res) => {
            if (!req.user && req.user.username !== req.params.username) {
                return res.redirect('/');
            }

            const newUser = req.body;
            newUser.username = req.user.username;

            data.users.updateProfile(newUser.username, newUser.firstName,
                newUser.lastName, newUser.age, newUser.email, newUser.avatar);

            return res.redirect(201, '/users/' + newUser.username);
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
                    return res.render('partials/events', {
                        events: events,
                    });
                });
        },
        searchUser: (req, res) => { // Check this later
            const pattern = req.query.name;
            const partial = req.query.isPartial;

            if (partial) {
                return data.users.getUserByPattern(pattern)
                .then((users) => {
                    return res.render('partials/users', {
                        users: users,
                    });
                });
            }

            return data.users.getUserByPattern(pattern)
                .then((users) => {
                    return res.render('users/users', {
                        title: 'Search: ' + pattern,
                        users: users,
                    });
                });
        },
    };
};
