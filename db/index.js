const { MongoClient } = require('mongodb');
const pkg = require('../package.json')

const strConn = 'mongodb://api_message:justMe2018@cluster0-shard-00-00-rfzlw.azure.mongodb.net:27017,cluster0-shard-00-01-rfzlw.azure.mongodb.net:27017,cluster0-shard-00-02-rfzlw.azure.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
const strConn2 = 'mongodb+srv://api_message:justMe2018@cluster0-rfzlw.azure.mongodb.net/test?retryWrites=true';
const strDbName = 'api_message';
const defaultDatabaseFilename = () => path.join(homedir(), `${pkg.name}`);
const modelNames = ['user', 'message', 'contact'];

const initClient = async (strConnection = undefined || strConn2) => {
    return await MongoClient.connect(strConnection, {
        useNewUrlParser: true,
        domainsEnabled: true,
    });
};
const connectDatabase = async (strConnection = undefined || strConn2, dbName = undefined || strDbName) => {
    var client = await initClient(strConn);
    var db = client.db(dbName);
    var collection = await db.collections();
    return { ...db, ...collection.reduce((obj, collection) => ({ ...obj, [collection.collectionName]: collection }), {}) };
}

const seedDb = async (query, seedName) => {
    const { up } = require(path.join(__dirname, 'seeds', `${seedName}.js`));
    await up(query);
}

module.exports = { connectDatabase, seedDb };