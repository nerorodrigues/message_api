var express = require('express');
var { connectDatabase } = require('./db');
var { server } = require('./libs');

var registerInfoEndPoint = (app) => {
    app.get('/api/info', (req, res, next) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(JSON.stringify(process.env));
        next();
    });
    return app;
}

var initApp = async () => {
    var app = express();
    var db = await connectDatabase(process.env.SQLAZURECONNSTR_MONGO_DB, 'api_message');
    server.registerGraphQL(app, '/api/graphql', db, true).then(pX => {
        registerInfoEndPoint(pX);
    });
    return app;
}

initApp(port = process.env.PORT || 8081).then(pX => {
    pX.listen(port, () => {
        console.log("Server running at http://localhost:%d", port);
    });
});




