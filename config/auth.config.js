const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo')(session);
const config = require('./config');

const configAuth = (app, { users }, passport, db) => {
    app.use(cookieParser('keyboard cat'));
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());
    app.use(session({
        store: new MongoStore({ url: config.connectionString }),
        secret: 'Purple Unicorn',
        resave: true,
        saveUninitialized: true,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy((username, password, done) => {
        return users.login(username, password)
            .then((user) => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            });
    }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        users.getUserById(id)
            .then((user) => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            });
    });
};

module.exports = configAuth;
