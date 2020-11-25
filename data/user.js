const abm = require('./abm')

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'users'

async function getUsuario(connection, filter = {}) {
  return await abm.getItemById(connection, myCollection, filter)
}

async function pushUsuario(connection, usuario) {
  //ACA PODRIA IR UNA LOGICA PROPIA
  return await abm.pushItem(connection, myCollection, usuario)
}

async function deleteUsuario(connection, filter = {}) {
  //ACA PODRIA IR UNA LOGICA PROPIA
  return await abm.deleteItem(connection, myCollection, filter)
}



module.exports = { getUsuario, pushUsuario, deleteUsuario }
