const dotenv = require('dotenv').config()
const mongodb = require('mongodb')
const connection = require('./conexionMongo')
const abm = require('./abm')

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'movimientos'
const myType = 'gasto'

function cargoFecha(){
    const fechaFinal= new Date(Date.now())
    let fechaInicial =new Date(fechaFinal.setMonth(fechaFinal.getMonth() -5 ));
    return new Date(fechaInicial.setDate(1))
}
   
async function getSeisMeses(filter = {}) {
    filter.tipo = myType;
    const fechaFinal= new Date(Date.now())
    const fechaInicial= cargoFecha()
    filter.fecha= { $gte : fechaInicial, $lt: fechaFinal }
    return await abm.getCollection(myCollection, filter);
}

async function getAllGastos(filter = {}) {
  filter.tipo = myType
  return await abm.getCollection(myCollection, filter)
}

async function getGasto(filter = {}) {
  filter.tipo = myType
  return await abm.getItem(myCollection, filter)
}

async function pushGasto(gasto) {
  gasto.fecha = new Date(gasto.fecha)
  gasto.fechaImputacion = new Date(gasto.fechaImputacion)
  return await abm.pushItem(myCollection, gasto)
}

async function deleteGasto(filter = {}) {
  filter.tipo = myType
  return await abm.deleteItem(myCollection, filter)
}

async function deleteGastos(filter = {}) {
  filter.tipo = myType
  return await abm.deleteItems(myCollection, filter)
}

//HASTA NUEVO AVISO, EL EDIT LO MANEJAMOS INDIVIDUALMENTE
async function updateGasto(gasto) {
  const connectionmongo = await connection.getConnection()
  const query = { _id: mongodb.ObjectID(gasto._id) }
  const newvalues = {
    $set: {
      user: gasto.user,
      monto: gasto.monto,
      fecha: new Date(gasto.fecha),
      fechaImputacion: new Date(gasto.fechaImputacion),
      descripcion: gasto.descripcion,
      categoria: gasto.categoria,
      tipoPago: gasto.tipoPago,
    },
  }

  const result = await connectionmongo
    .db(process.env.MONGODB_DB_NAME)
    .collection(myCollection)
    .updateOne(query, newvalues)
  await connectionmongo.close()
  return result
}

module.exports = { getAllGastos, getGasto, pushGasto, deleteGasto, deleteGastos, updateGasto, getSeisMeses }