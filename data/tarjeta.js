const mongodb = require('mongodb')
const dotenv = require('dotenv').config()
const abm = require('./abm')

const myCollection = 'tarjetas'

async function getAllTarjetas(connection, filter = {}) {
  return await abm.getCollection(connection, myCollection, filter)
}

async function getTarjeta(connection, filter = {}) {
  return await abm.getItem(connection, myCollection, filter)
}

async function pushTarjeta(connection, tarjeta) {
  return await abm.pushItem(connection, myCollection, tarjeta)
}

async function deleteTarjeta(connection, filter = {}) {
  return await abm.deleteItem(connection, myCollection, filter)
}

async function updateTarjeta(connection, tarjeta) {
  const query = { _id: mongodb.ObjectID(tarjeta._id) }
  console.log({ query })
  const newvalues = {
    $set: {
      user: tarjeta.user,
      nombre: tarjeta.nombre,
      descripcion: tarjeta.descripcion,
    },
  }
  console.log({ newvalues })

  const result = await connection
    .db(process.env.MONGODB_DB_NAME)
    .collection(myCollection)
    .updateOne(query, newvalues)
  return result
}
module.exports = {
  getAllTarjetas,
  getTarjeta,
  pushTarjeta,
  deleteTarjeta,
  updateTarjeta,
}
