const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api', 
        { target: 'http://localhost:5000/' }
    ));
    app.use(proxy('/auth/signin/', 
    { target: 'http://localhost:3000/api/signin' }
));
}

