const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const getSchema = require('../graphql');
const bodyParser = require('body-parser');
const { configureAuthMiddleware, configureSubscriptionAuthMiddleware } = require('./auth');

const createSubscritionServer = (app, server) => {
    httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer)
    return httpServer;
};

const configureSubscriptionMiddleware = (express, apolloServer, useAuth = false, subscriptionPath = '/api/graphql') => {

    apolloServer.subscriptionServerOptions = {
        path: subscriptionPath
    };
    if (useAuth)
        configureSubscriptionAuthMiddleware(apolloServer);
    return createSubscritionServer(express, apolloServer);
};

module.exports = {
    registerGraphQL: async (server, graphqlPath, db, useAuth = false, userSubscription = false, subscriptionPath = undefined) => {
        const { schema, resolver } = await getSchema();
        var apolloServer = new ApolloServer({
            typeDefs: schema,
            resolvers: resolver,
            introspection: true,
            playground: true,
            context: ({ req }) => (req ? { user: req.user, db } : null)
        });
        apolloServer.applyMiddleware({
            app: server,
            path: graphqlPath, //'/api/graphql',
            cors: { origin: '*' },
            bodyParserConfig: bodyParser.json()
        });
        if (useAuth)
            configureAuthMiddleware(server, '/api/graphql');
        if (userSubscription) {
            configureSubscriptionMiddleware(server, apolloServer, subscriptionPath, useAuth);

        }
        return server;
    }
}