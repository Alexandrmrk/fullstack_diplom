const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api', 
        { target: 'http://localhost:5000/' }
    ));
    app.use(proxy('/auth/signin/', 
    { target: 'http://176.119.147.35' }
));
}

