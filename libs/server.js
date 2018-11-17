const { ApolloServer } = require('apollo-server-express');
const getSchema = require('../graphql');
const bodyParser = require('body-parser');
const { configureAuthMiddleware } = require('./auth');

module.exports = {
    registerGraphQL: async (server, graphqlPath, db, useAuth = false) => {
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
        return server;
    }
}