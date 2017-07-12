const express = require('express');

const init = (data) => {
    const app = express();
    app.set('view engine', 'pug');

    const homeController = require('./controllers/home.controller')();
    const eventsController = require('./controllers/events.controller')(data);
    const usersController = require('./controllers/users.controller')(data);

    app.get('/', homeController.index);
    app.get('/login', usersController.getLogin);
    app.post('/login', usersController.postLogin);
    app.get('/signup', usersController.getSignup);
    app.get('/signup', usersController.postSignup);
    app.get('/logout', usersController.logout);

    app.get('/events/create', eventsController.getCreateEvent);
    app.post('/events/create', eventsController.postCreateEvent);
    app.get('/events/:eventId', eventsController.getEventById);

    // Get events by category name
    app.get('/categories', eventsController.getAllCategories);
    app.get('/categories/:categoryName',
        eventsController.getAllEventsByCategory);

    // Get events by date
    app.get('/date', eventsController.getCalendar);
    app.get('/date/:selectedDate', eventsController.getAllEventsByDate);

    app.get('/users/:username', usersController.getUserProfile);
    app.get('/users/:username/edit', usersController.getUpdateUserProfile);
    app.post('/users/:username/edit', usersController.postUpdateUserProfile);
    app.get('/users/:username/myEvents', usersController.getUserEvents);

    return app;
};

module.exports = {
    init,
};
