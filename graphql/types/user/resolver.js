const controller = require('../../../controllers/user');
const bcryptjs = require('bcryptjs');
const { auth } = require('../../../libs')
module.exports = {
    resolver: {
        User: {
            id: ({ _id }) => _id.toString()
        },
        Query: {
            user: (root, args, { db }) => {
                return controller.getUserList(db).toArray();
            },
            me: async (root, args, { user, db }) => {
                var data = await controller.findUserById(db, user.id);
                return data;
            },
        },
        Mutation: {
            signin: async (root, args, { db }) => {
                var user = await controller.findUser(db, args.userName);
                if (user) {
                    var senha = await bcryptjs.hash(args.password, 10);
                    if (await bcryptjs.compare(args.password, user.password)) {
                        return auth.authenticate(
                            { id: user._id, email: user.email },
                            { expiresIn: '1d' }
                        );
                    }
                }
                throw new Error("User not found or Invalid password.");
            },
            signUp: async (root, args, { db }) => {
                try {
                    await controller.saveUser(db, args);
                    return true;
                } catch (error) {
                    throw error;
                }
            },
            updateProfile: async (root, args, { user, db }) => {
                return await controller.updateProfile(db, args.profile, user.id);
            },
            checkEmailAvailability: async (root, args, { db }) => {
                return await controller.checkAvailability(db, { email: args.email });
            },
            checkUserNameAvailability: async (root, args, { db }) => {
                return await controller.checkAvailability(db, { userName: args.userName });
            }
        }
    }
}