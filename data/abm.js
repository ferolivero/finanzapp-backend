const fs = require('fs').promises;
const connection = require('./conexionMongo');

async function getCollection(collectionName){
    const connectionmongo = await connection.getConnection();
    const collection = await connectionmongo
                        .db('finanzapp')
                        .collection(collectionName)
                        .find()
                        .toArray();
    
    return collection;
}

async function getItem(collectionName, id){
    const connectionmongo = await connection.getConnection();
    const item = await connectionmongo
                            .db('finanzapp')
                            .collection(collectionName)
                            .findOne({_id: parseInt(id)});
    return item;
}

async function pushItem(collectionName, item){
    const connectionmongo = await connection.getConnection();
    const result = await connectionmongo
                            .db('finanzapp')
                            .collection(collectionName)
                            .insertOne(item);
    return result;
}

// async function updateItem(collectionName, item){
//     const connectionmongo = await connection.getConnection();
//     const query = {_id: parseInt(item._id)};
//     const newvalues = { $set : {
//             first: inventor.first,
//             last: inventor.last,
//             year: inventor.year,
//             img: inventor.img            
//         }
//     };

//     const result = await connectionmongo
//                             .db('finanzapp')
//                             .collection(collectionName)
//                             .updateOne(query, newvalues);
//     return result;
// }


async function deleteItem(collectionName, id){
    const connectionmongo = await connection.getConnection();
    const result = await connectionmongo
                            .db('finanzapp')
                            .collection(collectionName)
                            .deleteOne({_id: parseInt(id)});
    return result;
}

module.exports = {getCollection, getItem, pushItem, deleteItem}
