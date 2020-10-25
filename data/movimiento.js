const mongodb = require('mongodb');
const fs = require('fs').promises;
const connection = require('./conexionMongo');
const dataGastos = require('./gasto');
const dataIngresos = require('./ingreso');


async function getAllMovimientosDesc(){
    let gastos = await dataGastos.getAllGastos();
    let ingresos = await dataIngresos.getAllIngresos();
    let movimientos = ingresos.concat(gastos).sort(compareDates);
    return movimientos;
}

function compareDates(a, b) {
    if (a.fecha > b.fecha) return -1;
    if (b.fecha > a.fecha) return 1;
  
    return 0;
  }

module.exports = {getAllMovimientosDesc}
