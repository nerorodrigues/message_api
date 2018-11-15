const express = require('express');
const getSchema = require('./graphql');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');

// var httpServer =  createServer((request, response)=>{
//     response.writeHead(200, { 'Content-Type': 'text/plain'});
//     response.end('Hi There!');
// });

var port = process.env.PORT || 8081;

//httpServer.listen(port);

const initApp = async () => {
    const app = express();

    const { schema, resolver } = await getSchema();

    var server = new ApolloServer({
        typeDefs: schema,
        resolvers: resolver,
        introspection: true,
        playground: true
    });

    server.applyMiddleware({
        app,
        path: '/api/graphql',
        cors: { origin: '*' },
        bodyParserConfig: bodyParser.json()

    })

    app.get('/api/home');
    app.use('/api/home', (req, res, next) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hi There!');
        console.log('aqui');
        next();
    });

    return app;
}

initApp().then(pX => pX.listen(port));


console.log("Server running at http://localhost:%d", port);

