const mongodb = require('mongodb')
const abm = require('./abm')
const { compareDates } = require('./../utils/utils')

const myCollection = 'movimientosRecurrentes'
const tipoIngreso = 'ingreso'
const tipoGasto = 'gasto'

async function getAllIngresos(connection, filter = {}) {
  filter.tipo = tipoIngreso
  return await abm.getCollection(connection, myCollection, filter)
}

async function getIngreso(connection, filter = {}) {
  filter.tipo = tipoIngreso
  return await abm.getItem(connection, myCollection, filter)
}

async function pushIngreso(connection, ingreso) {
  ingreso.fecha = new Date(ingreso.fecha)
  return await abm.pushItem(connection, myCollection, ingreso)
}

async function deleteIngreso(connection, filter = {}) {
  filter.tipo = tipoIngreso
  return await abm.deleteItem(connection, myCollection, filter)
}

async function updateIngresoRecurrente(connection, ingreso) {
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

async function getAllGastos(connection, filter = {}) {
  filter.tipo = tipoGasto
  console.log(filter)
  return await abm.getCollection(connection, myCollection, filter)
}

async function getGasto(connection, filter = {}) {
  filter.tipo = tipoGasto
  return await abm.getItem(connection, myCollection, filter)
}

async function pushGasto(connection, gasto) {
  gasto.fecha = new Date(gasto.fecha)
  return await abm.pushItem(connection, myCollection, gasto)
}

async function deleteGasto(connection, filter = {}) {
  filter.tipo = tipoGasto
  return await abm.deleteItem(connection, myCollection, filter)
}

async function updateGastoRecurrente(connection, gasto) {
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

async function updateCuota(connection) {
  const filter = {
    tipo: tipoGasto,
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

async function getAllMovimientosDesc(connection, filter = {}) {
  let movimientos = await abm.getCollection(connection, myCollection, filter)
  return movimientos.sort(compareDates)
}

module.exports = {
  getAllIngresos,
  getIngreso,
  pushIngreso,
  deleteIngreso,
  updateIngresoRecurrente,
  getAllGastos,
  getGasto,
  pushGasto,
  updateGastoRecurrente,
  deleteGasto,
  updateCuota,
  getAllMovimientosDesc,
}
