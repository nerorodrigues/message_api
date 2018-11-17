const controller = require('../../../controllers/user');

module.exports = {
    resolver: {
        User: {
            id: ({ _id }) => _id.toString()
        },
        Query: {
            user: (root, args, { db }) => {
                return controller.getUserList(db).toArray();
            }
        },
        Mutation: {
            signin: async (root, args, { db }) => {
                var user = await controller.findUser(db, args.userName);
                if (user) {
                    var senha = await bcryptjs.hash(args.password, 10);
                    if (await bcryptjs.compare(args.password, user.password)) {
                        return authenticate(
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
                    return 'Success';
                } catch (error) {
                    return error.message;
                }
            },
            checkEmailAvailability: async (root, args, { db }) => {
                return await controler.checkAvailability(db, { email: args.email });
            },
            checkUserNameAvailability: async (root, args, { db }) => {
                return await controler.checkAvailability(db, { userName: args.userName });
            }
        }
    }
}