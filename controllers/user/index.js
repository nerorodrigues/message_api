module.exports = {
    getUserList: (db) => {
        return db.user.find();
    },
    saveUser: async (db, data) => {
        const user = {
            userName: data.userName,
            email: data.email,
            password: await bcryptjs.hash(data.password, 10),
            creationDate: new Date(),
            status: 1
        }

        await db.user.insert(user);
        return user
    }
}