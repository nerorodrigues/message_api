const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs');

const privateKEY = fs.readFileSync('private.key', 'utf8');
const publicKEY = fs.readFileSync('public.key', 'utf8');

const verifyToken = async (authToken) => {
    const valid = await jsonwebtoken.verify(authToken, publicKEY, { algorithm: 'RS256' });
    return valid;
}

module.exports = {
    configureAuthMiddleware: (server, graphQLPath) => {
        var auth = jwt({
            secret: publicKEY,
            credentialsRequired: true
        });
        server.use(graphQLPath, auth);
    },
    configureSubscriptionAuthMiddleware: (apolloServer) => {
        if (apolloServer.subscriptionServerOptions)
            apolloServer.subscriptionServerOptions.onConnect = (connectionParams) => {
                if (connectionParams.authToken)
                    return verifyToken(connectionParams.authToken).then(pX => {
                        return pX;
                    });
                throw new Error('Not authenticated');
            };
        return apolloServer;
    },
    authenticate: (user, options) => {
        var tokenOptions = {
            algorithm: 'RS256',
            issuer: 'myApp',
            ...options
        }
        var token = jsonwebtoken.sign(user, privateKEY, tokenOptions);
        return token;
    },
    verifyToken: async (authToken) => verifyToken(authToken)
}