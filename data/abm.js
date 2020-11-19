const dotenv = require('dotenv').config();
const mongodb = require('mongodb');
const connection = require('./conexionMongo');

async function getCollection(collectionName, filter = {}){
    const connectionmongo = await connection.getConnection();
    const collection = await connectionmongo
                        .db(process.env.MONGODB_DB_NAME)
                        .collection(collectionName)
                        .find(filter)
                        .toArray();
    
    await connectionmongo.close()
    return collection;
}

async function getItem(collectionName, filter = {}){
    try {
        const connectionmongo = await connection.getConnection();
        filter._id = mongodb.ObjectID(filter.id);
        delete filter.id;
        console.log(filter);
        const item = await connectionmongo
                                .db(process.env.MONGODB_DB_NAME)
                                .collection(collectionName)
                                .findOne(filter);
        await connectionmongo.close()
        return item;
    } catch (err) {
        return null;
    }
}

async function getItemById(collectionName, filter = {}){
    const connectionmongo = await connection.getConnection();
    const item = await connectionmongo
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(collectionName)
                            .findOne({_id: filter.id});
    await connectionmongo.close()
    return item;
}

async function pushItem(collectionName, item){
    const connectionmongo = await connection.getConnection();
    const result = await connectionmongo
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(collectionName)
                            .insertOne(item);
    await connectionmongo.close()
    return result;
}

async function deleteItem(collectionName, filter = {}){
    const connectionmongo = await connection.getConnection();
    const result = await connectionmongo
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(collectionName)
                            .deleteOne({_id: mongodb.ObjectID(filter.id)});
    await connectionmongo.close()
    return result;
}

async function deleteItems(collectionName, filter = {}){
    const connectionmongo = await connection.getConnection();
    const result = await connectionmongo
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(collectionName)
                            .deleteMany(filter);
    await connectionmongo.close()
    return result;
}

module.exports = {getCollection, getItem, getItemById, pushItem, deleteItem, deleteItems }
