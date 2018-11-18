var express = require('express');
var { connectDatabase } = require('./db');
var { server } = require('./libs');
var appInsights = require('applicationinsights');

var registerInfoEndPoint = (app) => {
    app.get('/api/info', (req, res, next) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(JSON.stringify(process.env));
        next();
    });
    return app;
}

var initApp = async () => {
    let start = Date.now();
    appInsights.setup('390d85a5-7deb-464d-bdfa-d63c0b36fb4e');
    appInsights.start();

    var app = express();
    var db = await connectDatabase(process.env.SQLAZURECONNSTR_MONGO_DB, 'api_message');
    server.registerGraphQL(app, '/api/graphql', db, true, true, 'api/subscription').then(pX => {
        registerInfoEndPoint(pX);
    });
    // app.on('listening', () => {
    //     let duration = Date.now() - start;
    //     appInsights.defaultClient.trackMetric({ name: 'Server Startup time', value: duration });
    // });
    // app.set((req, res) => {
    //     // if (req.metho === 'GET') {
    //     //     appInsights.defaultClient.trackNodeHttpRequest({
    //     //         request: req,
    //     //         response: res
    //     //     });
    //     //     res.end();
    //     // }
    // });
    return app;
}

initApp(port = process.env.PORT || 8081).then(pX => {
    pX.listen(port, () => {
        console.log("Server running at http://localhost:%d", port);
    });
});




