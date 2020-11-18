const dotenv = require('dotenv').config();
const mongodb = require('mongodb');
const connection = require('./conexionMongo');
const abm = require('./abm');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'movimientos';
const myType = 'ingreso'

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

async function getAllIngresos(filter = {}) {
    filter.tipo = myType;
    return await abm.getCollection(myCollection, filter);
}

async function getIngreso(filter = {}) {
    filter.tipo = myType;
    return await abm.getItem(myCollection, filter);
}

async function pushIngreso(ingreso) {
    return await abm.pushItem(myCollection, ingreso);
}

async function deleteIngreso(filter = {}) {
    filter.tipo = myType;
    return await abm.deleteItem(myCollection, filter);
}

//HASTA NUEVO AVISO, EL EDIT LO MANEJAMOS INDIVIDUALMENTE
async function updateIngreso(ingreso){
    const connectionmongo = await connection.getConnection();
    const query = {_id: mongodb.ObjectID(ingreso._id)};
    const newvalues = { $set : {
            user: ingreso.user,
            monto: ingreso.monto,
            fecha: ingreso.fecha,
            descripcion: ingreso.descripcion,
            categoria: ingreso.categoria        
        }
    };

    const result = await connectionmongo
        .db(process.env.MONGODB_DB_NAME)
        .collection(myCollection)
        .updateOne(query, newvalues);
    return result;
}

module.exports = {getSeisMeses, getAllIngresos, getIngreso, pushIngreso, deleteIngreso, updateIngreso }
