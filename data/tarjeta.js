const mongodb = require('mongodb')
const dotenv = require('dotenv').config()
const abm = require('./abm')

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'tarjetas'

async function getAllTarjetas(connection, filter = {}) {
  //ACA PODRIA IR UNA LOGICA PROPIA
  return await abm.getCollection(connection, myCollection, filter)
}

async function getTarjeta(connection, filter = {}) {
  //ACA PODRIA IR UNA LOGICA PROPIA
  return await abm.getItem(connection, myCollection, filter)
}

async function pushTarjeta(connection, tarjeta) {
  //ACA PODRIA IR UNA LOGICA PROPIA
  return await abm.pushItem(connection, myCollection, tarjeta)
}

async function deleteTarjeta(connection, filter = {}) {
  //ACA PODRIA IR UNA LOGICA PROPIA
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
