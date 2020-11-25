const dotenv = require('dotenv').config()
const mongodb = require('mongodb')
const abm = require('./abm')

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'movimientos'
const myType = 'ingreso'

async function getAllIngresos(connection, filter = {}) {
  filter.tipo = myType
  return await abm.getCollection(connection, myCollection, filter)
}

async function getIngreso(connection, filter = {}) {
  filter.tipo = myType
  return await abm.getItem(connection, myCollection, filter)
}

async function pushIngreso(connection, ingreso) {
  ingreso.fecha = new Date(ingreso.fecha)
  return await abm.pushItem(connection, myCollection, ingreso)
}

async function deleteIngreso(connection, filter = {}) {
  filter.tipo = myType
  return await abm.deleteItem(connection, myCollection, filter)
}

//HASTA NUEVO AVISO, EL EDIT LO MANEJAMOS INDIVIDUALMENTE
async function updateIngreso(connection, ingreso) {
  const query = { _id: mongodb.ObjectID(ingreso._id) }
  const newvalues = {
    $set: {
      user: ingreso.user,
      monto: ingreso.monto,
      fecha: new Date(ingreso.fecha),
      descripcion: ingreso.descripcion,
      categoria: ingreso.categoria,
    },
  }

  const result = await connection
    .db(process.env.MONGODB_DB_NAME)
    .collection(myCollection)
    .updateOne(query, newvalues)
  return result
}

module.exports = {
  getAllIngresos,
  getIngreso,
  pushIngreso,
  deleteIngreso,
  updateIngreso,
}
