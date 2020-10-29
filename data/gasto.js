const mongodb = require('mongodb');
const fs = require('fs').promises;
const connection = require('./conexionMongo');
const abm = require('./abm');
const e = require('express');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'movimientos';
const myType = 'gasto';

async function getAllGastos() {
    return await abm.getCollection(myCollection, {tipo: myType});
}

async function getGasto(id) {
    return await abm.getItemByType(myCollection, id, myType);
}

async function pushGasto(gasto) {
    return await abm.pushItem(myCollection, gasto);
}

async function deleteGasto(id) {
    return await abm.deleteItem(myCollection, id);
}


//HASTA NUEVO AVISO, EL EDIT LO MANEJAMOS INDIVIDUALMENTE
async function updateGasto(gasto) {
    const connectionmongo = await connection.getConnection();
    const query = { _id: mongodb.ObjectID(gasto._id) };
    const newvalues = {
        $set: {
            idUsuario: gasto.idUsuario,
            monto: gasto.monto,
            fecha: gasto.fecha,
            fechaImputacion: gasto.fechaImputacion,
            descripcion: gasto.descripcion,
            categoria: gasto.categoria,
            tipoPago: gasto.tipoPago
        }
    };

    const result = await connectionmongo
        .db('finanzapp')
        .collection(myCollection)
        .updateOne(query, newvalues);
    return result;
}

module.exports = { getAllGastos, getGasto, pushGasto, deleteGasto, updateGasto }
