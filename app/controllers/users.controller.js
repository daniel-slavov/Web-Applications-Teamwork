/* eslint-disable no-console */
const { Validator } = require('../../utils/validator');
const passport = require('passport');
const bodyParser = require('body-parser');

module.exports = (data) => {
    return {
        getLogin: (req, res) => {
            if (req.user) {
                return res.redirect('/');
            }

            return res.render('login');
        },
        postLogin: (req, res) => {
            passport.authenticate('login', {
                successRedirect: '/',
                failureRedirect: '/login',
            });
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
