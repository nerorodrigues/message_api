const controller = require('../../../controllers/user');

module.exports = {
    resolver: {
        User: {
            id: () => 1,
            nome: () => 'Nero',
            sobrenome: () => 'Rodrigues'
        },
        Query: {
            user: (root, args, { db }) => {
                return controller.getUserList(db).toArray();
            }
        },
        Mutation: {
            signUp: async (root, args, { db }) => {
                return await controller.saveUser(db, args)
            }
        }
    }
}