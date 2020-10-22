const mongodb = require('mongodb');
const fs = require('fs').promises;
const connection = require('./conexionMongo');
const abm = require('./abm');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'ingresos';

async function getAllIngresos(){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.getCollection(myCollection);
}

async function getIngreso(id){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.getItem(myCollection, id);
}

async function pushIngreso(ingreso){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.pushItem(myCollection, ingreso);
}

async function deleteIngreso(id){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.deleteItem(myCollection, id);
}


//HASTA NUEVO AVISO, EL EDIT LO MANEJAMOS INDIVIDUALMENTE
async function updateIngreso(ingreso){
    const connectionmongo = await connection.getConnection();
    const query = {_id: mongodb.ObjectID(ingreso._id)};
    const newvalues = { $set : {
            idUsuario: ingreso.idUsuario,
            monto: ingreso.monto,
            fecha: ingreso.fecha,
            descripcion: ingreso.descripcion,
            categoria: ingreso.categoria        }
    };

    const result = await connectionmongo
                            .db('finanzapp')
                            .collection(myCollection)
                            .updateOne(query, newvalues);
    return result;
}

module.exports = {getAllIngresos, getIngreso, pushIngreso, deleteIngreso, updateIngreso }
