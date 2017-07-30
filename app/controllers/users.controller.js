const multer = require('multer');
const path = require('path');
const crypto = require('crypto-js');

module.exports = (data) => {
    return {
        getLogin: (req, res) => {
            if (req.user) {
                const username = req.user.username;

                return res.redirect('/users/' + username);
            }

            return res.render('login');
        },
        getSignup: (req, res) => {
            if (req.user) {
                const username = req.user.username;

                return res.redirect('/users/' + username);
            }

            return res.render('signup');
        },
        postSignup: (req, res) => {
            if (req.user) {
                const username = req.user.username;

                return res.redirect('/users/' + username);
            }

            const user = req.body;

            req.assert('username',
                'Username must be between 6 and 25 symbols.').len(6, 25);
            req.assert('password',
                'Passsword must be at least 6 symbols.').len(6);
            req.assert('passwordConfirm', 'Passwords do not match')
                .equals(user.password);
            req.assert('email', 'Email is not valid').isEmail();

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
                                errors.push({
                                    msg: `User with that 
                                    username already exists.` });

                                return res.render('signup', {
                                    context: user,
                                    errors: errors,
                                });
                            }

                            user.avatar = 'http://www.infozonelive.com/styles/FLATBOOTS/theme/images/user4.png';
                            user.events = [];
                            user.password = crypto
                                .SHA1(user.username + user.password)
                                .toString();
                            console.log(user.password);
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
            const username = req.params.username;

            return data.users.getUser(username)
                .then((user) => {
                    if (user === null) {
                        return res.redirect('/error');
                    }

                    if (req.user) {
                        return res.render('users/profile', {
                            context: user,
                            currentUser: req.user.username,
                        });
                    }

                    return res.render('users/profile', {
                        context: user,
                    });
                });
        },
        updateUserProfile: (req, res) => {
            if (!req.user || req.user.username !== req.params.username) {
                return res.redirect('/login');
            }

            req.assert('email', 'Email is not valid').isEmail();

            const newUser = req.body;
            newUser.username = req.user.username;

            return req.getValidationResult()
                .then((result) => {
                    if (!result.isEmpty()) {
                        // There are errors in validation

                        return res.status(400).render('errors/all', {
                            errors: result.array(),
                        });
                    }

                    data.users.updateProfile(
                        newUser.username, newUser.firstName,
                        newUser.lastName, newUser.age,
                        newUser.email);

                    return res.redirect(201, '/users/' + newUser.username);
                });
        },
        getUserEvents: (req, res) => {
            const username = req.params.username;

            return data.users.getEvents(username)
                .then((events) => {
                    if (events.length === 0) {
                        return res.render('partials/events');
                    }

                    return res.render('partials/events', {
                        events: events,
                    });
                });
        },
        searchUser: (req, res) => {
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
                    return res.render('search/search', {
                        title: pattern,
                        users: users,
                    });
                });
        },
        updateAvatar: (req, res) => {
            const username = req.params.username;

            if (!req.user || req.user.username !== username) {
                return res.redirect('/error');
            }

            return data.users.getUser(username)
                .then((user) => {
                    const storage = multer.diskStorage({
                        destination: 'static/images/uploads/',
                        filename: (request, file, callback) => {
                            callback(null, file.fieldname + '-' + Date.now()
                                + path.extname(file.originalname));
                        },
                    });

                    const upload = multer({
                        storage: storage,
                        fileFilter: (request, file, callback) => {
                            const ext = path.extname(file.originalname);
                            if (ext !== '.png' && ext !== '.jpg'
                                    && ext !== '.jpeg') {
                                return res.redirect('/error');
                            }

                            return callback(null, true);
                        },
                    }).single('userFile');

                    upload(req, res, (err) => {
                        const filePath = '../' + req.file.destination
                            + req.file.filename;

                        data.users.updateAvatar(req.user.username, filePath);

                        return res.redirect('/users/' + req.user.username);
                    });
                });
        },
    };
};
