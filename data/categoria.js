const dotenv = require('dotenv').config()
const abm = require('./abm')

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'categorias'

async function getAllCategorias(connection, filter = {}) {
  return await abm.getCollection(connection, myCollection, filter)
}

async function getCategoria(connection, myCollection, filter = {}) {
  //ACA PODRIA IR UNA LOGICA PROPIA
  return await abm.getItem(connection, myCollection, filter)
}
async function pushCategorias(categorias){

    return await abm.pushArrayItem(myCollection,categorias)
    
}

/*
async function pushCategoria(categoria){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.pushItem(myCollection, categoria);
}

async function deleteCategoria(id){
    .

    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.deleteItem(myCollection, {id: id});
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
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(myCollection)
                            .updateOne(query, newvalues);
    return result;
}
*/
module.exports = { getAllCategorias, getCategoria , pushCategorias}//, pushCategoria, deleteCategoria, updateCategoria }