const dotenv = require('dotenv').config();
const mongodb = require('mongodb');
const connection = require('./conexionMongo');
const abm = require('./abm');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'movimientos';
const myType = 'gasto';

async function getAllGastos(filter = {}) {
    filter.tipo = myType;
    return await abm.getCollection(myCollection, filter);
}

async function getGasto(filter = {}) {
    filter.tipo = myType;
    return await abm.getItem(myCollection, filter);
}

async function pushGasto(gasto) {
    return await abm.pushItem(myCollection, gasto);
}

async function deleteGasto(filter = {}) {
    filter.tipo = myType;
    return await abm.deleteItem(myCollection, filter);
}


//HASTA NUEVO AVISO, EL EDIT LO MANEJAMOS INDIVIDUALMENTE
async function updateGasto(gasto) {
    const connectionmongo = await connection.getConnection();
    const query = { _id: mongodb.ObjectID(gasto._id) };
    const newvalues = {
        $set: {
            user: gasto.user,
            monto: gasto.monto,
            fecha: gasto.fecha,
            fechaImputacion: gasto.fechaImputacion,
            descripcion: gasto.descripcion,
            categoria: gasto.categoria,
            tipoPago: gasto.tipoPago
        }
    };

    const result = await connectionmongo
        .db(process.env.MONGODB_DB_NAME)
        .collection(myCollection)
        .updateOne(query, newvalues);
    return result;
}

module.exports = { getAllGastos, getGasto, pushGasto, deleteGasto, updateGasto }
