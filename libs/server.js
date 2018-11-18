const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const getSchema = require('../graphql');
const bodyParser = require('body-parser');
const { configureAuthMiddleware, configureSubscriptionAuthMiddleware } = require('./auth');
const LoggedInDirective = require('../graphql/directives/loggedIn');
const IsTrueDirective = require('../graphql/directives/isTrueDirective');

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
            schemaDirectives: {
                loggedIn: LoggedInDirective,
                isTrue: IsTrueDirective
            },
            engine: {
                apiKey: "service:nerorodrigues-6857:LRMTsdWJB1Rx3N9Rs72T0w"
            },
            context: ({ req }) => (req ? { user: req.user, db } : null)
        });

        if (userSubscription)
            configureSubscriptionMiddleware(server, apolloServer, subscriptionPath, useAuth);
        if (useAuth)
            configureAuthMiddleware(server, '/api/graphql');

        apolloServer.applyMiddleware({
            app: server,
            path: graphqlPath, //'/api/graphql',
            cors: { origin: '*' },
            bodyParserConfig: bodyParser.json()
        });
        return server;
    }
}