const webdriver = require('selenium-webdriver');

const setupDriver = (url, ...browsers) => {
    const driverBuilder = new webdriver
        .Builder()
        .usingServer('http://localhost:4444/wd/hub');

    browsers.forEach((browserName) => 
        driverBuilder.withCapabilities({
            browserName,
            maxInstances: 5,
            })
    );
    
    const driver = driverBuilder.build();

    process.on('uncaughtException', (err) => {
        console.log('My error handler... ' + err);
    });

    return driver;
};

module.exports = { setupDriver };
