const mongodb = require('mongodb');
const fs = require('fs').promises;
const connection = require('./conexionMongo');
const abm = require('./abm');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'gastos';

async function getAllGastos(){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.getCollection(myCollection);
}

async function getGasto(id){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.getItem(myCollection, id);
}

async function pushGasto(gasto){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.pushItem(myCollection, gasto);
}

async function deleteGasto(id){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.deleteItem(myCollection, id);
}


//HASTA NUEVO AVISO, EL EDIT LO MANEJAMOS INDIVIDUALMENTE
async function updateGasto(gasto){
    const connectionmongo = await connection.getConnection();
    const query = {_id: mongodb.ObjectID(gasto._id)};
    const newvalues = { $set : {
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

module.exports = {getAllGastos, getGasto, pushGasto, deleteGasto, updateGasto }
