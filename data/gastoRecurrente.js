// const dotenv = require('dotenv').config()
const mongodb = require('mongodb')
const connection = require('./conexionMongo')
const abm = require('./abm')


//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'movimientosRecurrentes'
const myType = 'gasto'

async function getAllGastos(filter = {}) {
  filter.tipo = myType
  console.log(filter)
  return await abm.getCollection(myCollection, filter)
}

async function getGasto(filter = {}) {
  filter.tipo = myType
  return await abm.getItem(myCollection, filter)
}

async function pushGasto(gasto) {
  gasto.fecha = new Date(gasto.fecha)
  return await abm.pushItem(myCollection, gasto)
}

async function deleteGasto(filter = {}) {
  filter.tipo = myType
  return await abm.deleteItem(myCollection, filter)
}


async function updateCuota() {
  const connectionmongo = await connection.getConnection()
  const filter = { tipo: myType, cuotas: { $exists: true}, cuotasRestantes: { $gt: 0 }  }
  const updateDoc = {
    $inc: {
      cuotasRestantes: -1,
    },
  };
  const result = await connectionmongo
    .db(process.env.MONGODB_DB_NAME)
    .collection(myCollection)
    .updateMany(filter, updateDoc)
  return result
}

module.exports = { getAllGastos, getGasto, pushGasto, deleteGasto, updateCuota }
