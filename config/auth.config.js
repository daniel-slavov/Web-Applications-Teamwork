const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const configAuth = (app, { users }, passport) => {
    app.use(cookieParser());
    app.use(session({
        secret: 'Pesho',
        resave: true,
        saveUninitialized: true,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    passport.use(new LocalStrategy((username, password, done) => {
        return users.login(username, password)
            .then((user) => {
                if (!user) {
                    return done(null, false,
                        { message: 'Incorrect username or password.' });
                }

                return done(null, user);
            });
    }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        users.getUserById(id, (err, user) => {
            done(err, user);
        });
    });
};

module.exports = configAuth;
