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
    
    return collection;
}

async function getItem(collectionName, filter = {}){
    const connectionmongo = await connection.getConnection();
    const item = await connectionmongo
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(collectionName)
                            .findOne({_id: mongodb.ObjectID(filter.id)});
    return item;
}

async function getItemByType(collectionName, filter = {}){
    const connectionmongo = await connection.getConnection();
    const item = await connectionmongo
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(collectionName)
                            .findOne({_id: mongodb.ObjectID(filter.id), tipo: filter.tipo});
    return item;
}

async function getItemById(collectionName, filter = {}){
    const connectionmongo = await connection.getConnection();
    const item = await connectionmongo
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(collectionName)
                            .findOne({_id: id});
    return item;
}

async function pushItem(collectionName, item){
    const connectionmongo = await connection.getConnection();
    const result = await connectionmongo
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(collectionName)
                            .insertOne(item);
    return result;
}

async function deleteItem(collectionName, filter = {}){
    const connectionmongo = await connection.getConnection();
    const result = await connectionmongo
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(collectionName)
                            .deleteOne({_id: mongodb.ObjectID(filter.id)});
    return result;
}

module.exports = {getCollection, getItem, getItemByType, getItemById, pushItem, deleteItem }
