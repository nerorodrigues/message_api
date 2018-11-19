const { ObjectID } = require('mongodb');
const status = require('../../libs/enums');
module.exports = {
    inviteContact: async (db, requestedContactId, userId) => {
        try {
            var contact = await db.contact.findOne({
                $or: [
                    { $and: [{ userId: ObjectID(userId) }, { requestedContactId: ObjectID(requestedContactId) }] },
                    { $and: [{ requestedContactId: ObjectID(userId) }, { userId: ObjectID(requestedContactId) }] }
                ]
            });
            if (!contact)
                db.contact.insertOne({
                    userId: ObjectID(userId),
                    requestedContactId: ObjectID(requestedContactId),
                    status: status.pending
                });
        } catch (error) {
            console.log(error);
        }
    },
    pendingsRequests: async (db, userId) => {
        var data = await db.contact.aggregate([{
            $match: {
                $and: [
                    { status: status.pending },
                    { requestedContactId: ObjectID(userId) },
                ]
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        }]).toArray();

        return data.map(pX => pX.user)
    },
    myContactRequests: async (db, userId) => {
        var data = await db.contact.aggregate([{
            $match: {
                $and: [
                    { status: status.pending },
                    { userId: ObjectID(userId) },
                ]
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "requestedContactId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        }]).toArray();
        return data.map(pX => pX.user);
    },
    contactList: async (db, userId) => {
        var data = await db.contact.aggregate([{
            $match: {
                $and: [
                    { status: status.accepted },
                    { $or: [{ userId: ObjectID(userId) }, { requestedContactId: ObjectID(userId) }] },
                ]
            }
        },
        {
            $lookup: {
                from: "user",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $and: [{ _id: "$userId" }, { _Id: { $not: ObjectID(userId) } }] },
                                    { $and: [{ _id: "$requestedContactId" }, { _Id: { $not: ObjectID(userId) } }] }
                                ]
                            }
                        }
                    }
                ],
                // localField: "requestedContactId",
                // foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        }]).toArray();
        var result = data.map(pX => pX.user);
        return result;
        // return db.contact.find({
        //     $and: [
        //         { status: status.accepted },
        //         {
        //             $or: [
        //                 {
        //                     $and: [{ userId: ObjectID(userId) },
        //                     { requestedContactId: ObjectID(requestedContactId) }]
        //                 },
        //                 {
        //                     $and: [
        //                         { requestedContactId: ObjectID(userId) },
        //                         { userId: ObjectID(requestedContactId) },
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // });
    },
    acceptContactInvite: (db, requestId) => {
        db.contact.updateOne({ _id: ObjectID(requestId) }, {
            $set: {
                status: status.accepted
            }
        });
    }
}