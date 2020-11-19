const abm = require('./abm')

const myCollection = 'movimientosRecurrentes'

async function getAllMovimientosDesc(connection, filter = {}) {
  let movimientos = await abm.getCollection(connection, myCollection, filter)
  return movimientos.sort(compareDates)
}

function compareDates(a, b) {
  if (a.fecha > b.fecha) return -1
  if (b.fecha > a.fecha) return 1
  return 0
}

module.exports = { getAllMovimientosDesc }
