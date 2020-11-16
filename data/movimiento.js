const abm = require('./abm');

const myCollection = 'movimientos';

async function getAllMovimientosDesc(filter = {}){
    let movimientos = await abm.getCollection(myCollection, filter);
    return movimientos.sort(compareDates);
}

async function imputarRecurrentes(movs) {
    const connectionmongo = await connection.getConnection()
    const options = { ordered: true };
    const result = await connectionmongo
      .db(process.env.MONGODB_DB_NAME)
      .collection(myCollection)
      .insertMany(movs, options)
    return result
  }


function compareDates(a, b) {
    if (a.fecha > b.fecha) return -1;
    if (b.fecha > a.fecha) return 1;
    return 0;
}

module.exports = {getAllMovimientosDesc, imputarRecurrentes}
