const abm = require('./abm')

const myCollection = 'movimientos'

async function getAllMovimientosDesc(filter = {}) {
  let movimientos = await abm.getCollection(myCollection, filter)
  return movimientos.sort(compareDates)
}

async function imputarRecurrentes(movs) {
  
  return await abm.pushArrayItem(myCollection,movs)
  
}

async function getMovimiento(filter = {}) {
  // filter.tipo = myType
  return await abm.getItem(myCollection, filter)
}

function compareDates(a, b) {
  if (a.fecha > b.fecha) return -1
  if (b.fecha > a.fecha) return 1
  return 0
}

module.exports = { getAllMovimientosDesc, imputarRecurrentes, getMovimiento }
