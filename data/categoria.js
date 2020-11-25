const dotenv = require('dotenv').config()
const mongodb = require('mongodb')
const abm = require('./abm')

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'categorias'

async function getAllCategorias(connection, filter = {}) {
  return await abm.getCollection(connection, myCollection, filter)
}

async function getCategoria(connection, filter = {}) {
  //ACA PODRIA IR UNA LOGICA PROPIA
  return await abm.getItem(connection, myCollection, filter)
}
async function pushCategorias(connection, categorias){

    return await abm.pushArrayItem(connection, myCollection, categorias)
    
}


async function pushCategoria(connection ,categoria){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.pushItem(connection , myCollection, categoria);
}

async function deleteCategoria(id){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.deleteItem(myCollection, {id: id});
}

async function updateCategoria(connection, categoria){
   
    const query = { _id: mongodb.ObjectID(categoria.id) }
    const newvalues = {
        $set: {
        tipo : categoria.tipo,        
        nombre: categoria.nombre,
        user: categoria.user,
        },
    }

    const result = await connection
        .db(process.env.MONGODB_DB_NAME)
        .collection(myCollection)
        .updateOne(query, newvalues)
        return result
    }

module.exports = { getAllCategorias, getCategoria , pushCategorias, deleteCategoria , updateCategoria , pushCategoria}//, pushCategoria, ,  }
