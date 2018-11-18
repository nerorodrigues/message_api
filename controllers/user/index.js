const bcryptjs = require('bcryptjs');
const { ObjectID } = require('mongodb');
module.exports = {
    getUserList: (db) => {
        return db.user.find();
    },
    findUser: (db, email) => {
        return db.user.findOne({ $or: [{ email: email }, { userName: email }] });
    },
    findUserById: async (db, id) => {
        return await db.user.findOne({ _id: ObjectID(id) });
    },
    saveUser: async (db, { user }) => {
        var userData = await db.user.findOne({ $or: [{ userName: user.userName }, { email: user.email }] });
        if (!userData) {
            var user = {
                userName: user.userName,
                email: user.email,
                password: await bcryptjs.hash(user.password, 10),
                creationDate: new Date(),
                status: 1
            }

            await db.user.insert(user);
            return user
        }
        throw new Error('The emails is alread taken');
    },
    checkAvailability: async (db, data) => {
        return await db.user.count(data) == 0;
    }
}