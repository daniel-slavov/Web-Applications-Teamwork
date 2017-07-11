const express = require('express');

const init = (data) => {
    const app = express();
    app.set('view engine', 'pug');

    // Server-side routings here
    app.get('/', (req, res) => {
        return res.render('home');
    });

    return app;
};

module.exports = {
    init, 
};
