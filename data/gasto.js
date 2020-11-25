const dotenv = require('dotenv').config()
const mongodb = require('mongodb')
const abm = require('./abm')

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'movimientos'
const myType = 'gasto'


async function getAllGastos(connection, filter = {}) {
  filter.tipo = myType
  return await abm.getCollection(connection, myCollection, filter)
}

async function getGasto(connection, filter = {}) {
  filter.tipo = myType
  return await abm.getItem(connection, myCollection, filter)
}

async function pushGasto(connection, gasto) {
  gasto.fecha = new Date(gasto.fecha)
  gasto.fechaImputacion = new Date(gasto.fechaImputacion)
  return await abm.pushItem(connection, myCollection, gasto)
}

async function deleteGasto(connection, filter = {}) {
  filter.tipo = myType
  return await abm.deleteItem(connection, myCollection, filter)
}

async function deleteGastos(connection, filter = {}) {
  filter.tipo = myType
  return await abm.deleteItems(connection, myCollection, filter)
}

//HASTA NUEVO AVISO, EL EDIT LO MANEJAMOS INDIVIDUALMENTE
async function updateGasto(connection, gasto) {
  const query = { _id: mongodb.ObjectID(gasto._id) }
  const newvalues = {
    $set: {
      user: gasto.user,
      monto: gasto.monto,
      fecha: new Date(gasto.fecha),
      fechaImputacion: new Date(gasto.fechaImputacion),
      descripcion: gasto.descripcion,
      categoria: gasto.categoria,
      tipoPago: gasto.tipoPago,
    },
  }

  const result = await connection
    .db(process.env.MONGODB_DB_NAME)
    .collection(myCollection)
    .updateOne(query, newvalues)
  return result
}

module.exports = {
  getAllGastos,
  getGasto,
  pushGasto,
  deleteGasto,
  deleteGastos,
  updateGasto,
}
