const bcryptjs = require('bcryptjs');
const { ObjectID } = require('mongodb');


module.exports = {
    getUserList: (db) => {
        return db.user.find();
    },
    findUser: (db, filter) => {
        return db.user.findOne({ $or: [{ email: filter }, { userName: filter }] });
    },
    findUsers: (db, filter) => {
        var filterData = RegExp(filter);
        return db.user.find({
            $and: [
                { name: { $exists: true } },
                { $or: [{ email: filterData }, { userName: filterData }] }
            ]
        });
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
        throw new Error('The email/username is alread taken');
    },
    updateProfile: (db, profile, userId) => {
        let result = db.user.updateOne({ _id: ObjectID(userId) }, {
            $set: {
                name: profile.name,
                lastName: profile.lastName,
                birthDate: new Date(profile.birthDate)
            }
        });

        return db.user.findOne({ _id: ObjectID(userId) });
    },
    checkAvailability: async (db, data) => {
        return await db.user.count(data) == 0;
    }
}