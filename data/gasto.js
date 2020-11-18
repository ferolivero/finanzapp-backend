const dotenv = require('dotenv').config();
const mongodb = require('mongodb');
const connection = require('./conexionMongo');
const abm = require('./abm');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'movimientos';
const myType = 'gasto';

function cargoFecha(fechaFinal){

    if(fechaFinal.getMonth()>5){
        let mes =fechaFinal.getMonth()-5
        var fechaIni= new Date(2020,mes,01)
    }else{
        let mes=fechaFinal.getMonth()-5
        mes= 12+(mes)
        let anio=fechaFinal.getFullYear()-1
        var fechaIni= new Date(anio,mes,01)//new Date("2020-01-01T02:30:00Z");
    }
    return fechaIni
}

async function getSeisMeses(filter = {}) {
    filter.tipo = myType;
    const fechaFinal= new Date()//("2020-03-10T02:30:00Z")
    const fechaInicial= cargoFecha(fechaFinal)
    filter.fecha= { $gte : fechaInicial, $lt: fechaFinal }
    return await abm.getCollection(myCollection, filter);
}

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

module.exports = { getSeisMeses, getAllGastos, getGasto, pushGasto, deleteGasto, updateGasto }
