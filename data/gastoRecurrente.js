const dotenv = require('dotenv').config()
const abm = require('./abm')

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'movimientosRecurrentes'
const myType = 'gasto'

async function getAllGastos(connection, filter = {}) {
  filter.tipo = myType
  console.log(filter)
  return await abm.getCollection(connection, myCollection, filter)
}

async function getGasto(connection, filter = {}) {
  filter.tipo = myType
  return await abm.getItem(connection, myCollection, filter)
}

async function pushGasto(connection, gasto) {
  gasto.fecha = new Date(gasto.fecha)
  return await abm.pushItem(connection, myCollection, gasto)
}

async function deleteGasto(connection, filter = {}) {
  filter.tipo = myType
  return await abm.deleteItem(connection, myCollection, filter)
}

async function updateCuota(connection) {
  const filter = {
    tipo: myType,
    cuotas: { $exists: true },
    cuotasRestantes: { $gt: 0 },
  }
  const updateDoc = {
    $inc: {
      cuotasRestantes: -1,
    },
  }
  const result = await connection
    .db(process.env.MONGODB_DB_NAME)
    .collection(myCollection)
    .updateMany(filter, updateDoc)
  return result
}

module.exports = { getAllGastos, getGasto, pushGasto, deleteGasto, updateCuota }
