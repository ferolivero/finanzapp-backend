const fs = require('fs').promises;
const abm = require('./abm');

const myCollection = 'movimientos';

async function getAllMovimientosDesc(){
    let movimientos = await abm.getCollection(myCollection);
    return movimientos.sort(compareDates);
}

function compareDates(a, b) {
    if (a.fecha > b.fecha) return -1;
    if (b.fecha > a.fecha) return 1;
    return 0;
}

module.exports = {getAllMovimientosDesc}
