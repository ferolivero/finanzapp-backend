const mongodb = require('mongodb');
const fs = require('fs').promises;
const connection = require('./conexionMongo');
const abm = require('./abm');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'categorias';

async function getAllCategorias(tipo = null) {
    if (tipo) {
        return await abm.getCollection(myCollection, { tipo: tipo });
    } else {
        return await abm.getCollection(myCollection);
    }
}

async function getCategoria(myCollection, id) {
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.getItem(myCollection, id);
}
/*
async function pushCategoria(categoria){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.pushItem(myCollection, categoria);
}

async function deleteCategoria(id){
    .

    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.deleteItem(myCollection, id);
}

async function updateCategoria(categoria){
    const connectionmongo = await connection.getConnection();
    const query = {_id: parseInt(categoria._id)};
    const newvalues = { $set : {
            idUsuario: categoria.idUsuario,
            nombre: categoria.nombre,
            descripcion: categoria.descripcion
        }
    };

    const result = await connectionmongo
                            .db('finanzapp')
                            .collection(myCollection)
                            .updateOne(query, newvalues);
    return result;
}
*/
module.exports = { getAllCategorias, getCategoria }//, pushCategoria, deleteCategoria, updateCategoria }
