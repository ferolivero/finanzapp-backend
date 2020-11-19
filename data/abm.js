const dotenv = require('dotenv').config()
const mongodb = require('mongodb')

async function getCollection(connection, collectionName, filter = {}) {
  const collection = await connection
    .db(process.env.MONGODB_DB_NAME)
    .collection(collectionName)
    .find(filter)
    .toArray()
  return collection
}

async function getItem(connection, collectionName, filter = {}) {
  try {
    filter._id = mongodb.ObjectID(filter.id)
    delete filter.id
    console.log(filter)
    const item = await connection
      .db(process.env.MONGODB_DB_NAME)
      .collection(collectionName)
      .findOne(filter)
    return item
  } catch (err) {
    return null
  }
}

async function getItemById(connection, collectionName, filter = {}) {
  const item = await connection
    .db(process.env.MONGODB_DB_NAME)
    .collection(collectionName)
    .findOne({ _id: filter.id })
  return item
}

async function pushItem(connection, collectionName, item) {
  const result = await connection
    .db(process.env.MONGODB_DB_NAME)
    .collection(collectionName)
    .insertOne(item)
  return result
}

async function deleteItem(connection, collectionName, filter = {}) {
  const result = await connection
    .db(process.env.MONGODB_DB_NAME)
    .collection(collectionName)
    .deleteOne({ _id: mongodb.ObjectID(filter.id) })
  return result
}

async function deleteItems(connection, collectionName, filter = {}) {
  const result = await connection
    .db(process.env.MONGODB_DB_NAME)
    .collection(collectionName)
    .deleteMany(filter)
  return result
}

async function pushArrayItem(connection, collectionName, items){
    const options = { ordered: true }
    const result = await connection
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(collectionName)
                            .insertMany(items, options)
    return result;
}
    
module.exports = {
  getCollection,
  getItem,
  getItemById,
  pushItem,
  pushArrayItem,
  deleteItem,
  deleteItems,
}
