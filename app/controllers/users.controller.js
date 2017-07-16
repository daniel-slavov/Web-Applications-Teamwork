/* eslint-disable no-console */
const { Validator } = require('../../utils/validator');

module.exports = (data) => {
    return {
        getLogin: (req, res) => {
            return res.render('login');
        },
        postLogin: (req, res) => {

        },
        getSignup: () => {

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
