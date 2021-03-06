const abm = require('./abm')

const myCollection = 'movimientos'

async function getAllMovimientosDesc(connection, filter = {}) {
  let movimientos = await abm.getCollection(connection, myCollection, filter)
  return movimientos.sort(compareDates)
}

async function imputarRecurrentes(connection, movs) {
  return await abm.pushArrayItem(connection, myCollection,movs)
}

async function getMovimiento(connection, filter = {}) {
  return await abm.getItem(connection, myCollection, filter)
}

function compareDates(a, b) {
  if (a.fecha > b.fecha) return -1
  if (b.fecha > a.fecha) return 1
  return 0
}

module.exports = { getAllMovimientosDesc, imputarRecurrentes, getMovimiento }
