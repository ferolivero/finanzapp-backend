const mongodb = require('mongodb');
const fs = require('fs').promises;
const connection = require('./conexionMongo');
const abm = require('./abm');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'movimientos';
const myType = 'ingreso';

async function getAllIngresos(){
    return await abm.getCollection(myCollection, {tipo: myType});
}

async function getIngreso(id){
    return await abm.getItemByType(myCollection, id, myType);
}

async function pushIngreso(ingreso){
    return await abm.pushItem(myCollection, ingreso);
}

async function deleteIngreso(id){
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
