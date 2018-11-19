const controller = require('../../../controllers/contact');

module.exports = {
    resolver: {
        Query: {
            pendingsRequests: (root, args, { user, db }) => {
                return controller.pendingsRequests(db, user.id);
            },
            myContactRequests: (root, args, { user, db }) => {
                return controller.myContactRequests(db, user.id);
            },
            contactList: (root, args, { user, db }) => {
                return controller.contactList(db, user.id);
            }
        },
        Mutation: {
            inviteContact: (root, { userId }, { user, db }) => {
                controller.inviteContact(db, userId, user.id);
            },
            acceptContactInvite: (root, { requestId }, { user, db }) => {
                controller.acceptContactInvite(db, requestId);
            }
        }
    }
}