/* globals __dirname */
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');

const init = (data) => {
    const app = express();
    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    app.set('view engine', 'pug');
    app.use('/libs', express.static('node_modules'));
    app.use(express.static('public'));
    // app.use(express.static(path.join(__dirname, 'public')));
    app.use('/static', express.static(path.join(__dirname, '../static')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(expressValidator());

    const homeController = require('./controllers/home.controller')(data);
    const eventsController = require('./controllers/events.controller')(data);
    const usersController = require('./controllers/users.controller')(data);
    const errorsController = require('./controllers/errors.controller')();

    require('../config/auth.config')(app, data, passport);
    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });
    app.use(require('connect-flash')());
    app.use((req, res, next) => {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });

    app.get('/', homeController.index);
    app.get('/login', usersController.getLogin);
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
    }));

    app.get('/signup', usersController.getSignup);
    app.post('/signup', usersController.postSignup);
    app.get('/logout', usersController.logout);

    // Events routes
    app.get('/events', eventsController.getAllEvents);
    app.get('/events/create', eventsController.getCreateEvent);
    app.post('/events/create', eventsController.postCreateEvent);
    app.get('/events/:title', eventsController.getEventByTitle);
    app.put('/api/events/:title', eventsController.updateEvent);
    app.delete('/api/events/:title', eventsController.deleteEvent);
    app.put('/api/events/:title/upvote', eventsController.upvote);

    // Categories routes
    app.get('/categories', eventsController.getAllCategories);
    app.get('/categories/:name', eventsController.getAllEventsByCategory);
    app.get('/api/categories/:name', eventsController.getEventsByCategory);

    // Calendar routes
    app.get('/events-calendar', eventsController.getCalendar);
    app.get('/api/events-calendar/:date', eventsController.getAllEventsByDate);

    // Users routes
    app.get('/users/:username', usersController.getUserProfile);
    app.put('/users/:username', usersController.updateUserProfile);
    app.get('/api/users/:username/events', usersController.getUserEvents);

    // Search routes
    app.get('/search', homeController.search);
    app.get('/search/events', eventsController.searchEvent);
    app.get('/search/users', usersController.searchUser);

    // Error route
    app.get('/error', errorsController.show);

    // Upload file routes
    app.get('/api/upload', homeController.getUpload);
    app.post('/api/users/:username/upload/avatar',
        usersController.updateAvatar);
    app.post('/api/events/:title/upload/photo', eventsController.updatePhoto);

    io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
            data.chats.addMessage(msg);
            io.emit('chat message', msg);
        });
        socket.on('disconnect', () => {
        });
    });

    return app;
};

module.exports = {
    init,
};
