const { Validator } = require('../../utils/validator');
const bodyParser = require('body-parser');

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
        postSignup: () => {

        },
        logout: (req, res) => {
            req.logout();
            return res.redirect('/');
        },
        getUserProfile: (req, res) => {
            const username = req.params.username;
            data.users.getUser(username)
                .then((user) => {
                    res.render('profile', {
                        context: user.username,
                    });
                });
        },
        getUpdateUserProfile: () => {

        },
        postUpdateUserProfile: () => {

        },
        getUserEvents: () => {

        },
    };
};
