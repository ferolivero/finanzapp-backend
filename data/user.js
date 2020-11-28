const dotenv = require('dotenv').config()
const abm = require('./abm')

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'users'

async function getUsuario(connection, filter = {}) {
  return await abm.getItemById(connection, myCollection, filter)
}

async function pushUsuario(connection, usuario) {
  return await abm.pushItem(connection, myCollection, usuario)
}

async function updateUsuario(connection, usuario) {
  const query = { _id: usuario._id }
  const newvalues = {
    $set: {
      moneda: usuario.moneda,
    },
  }
  console.log({ newvalues })

  const result = await connection
    .db(process.env.MONGODB_DB_NAME)
    .collection(myCollection)
    .updateOne(query, newvalues)
  return result
}

async function deleteUsuario(connection, filter = {}) {
  return await abm.deleteItem(connection, myCollection, filter)
}

module.exports = { getUsuario, pushUsuario, updateUsuario, deleteUsuario }
