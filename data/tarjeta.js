const dotenv = require('dotenv').config();
const connection = require('./conexionMongo');
const abm = require('./abm');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'tarjetas';

async function getAllTarjetas(filter = {}){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.getCollection(myCollection, filter);
}

async function getTarjeta(filter = {}){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.getItem(myCollection, filter);
}

async function pushTarjeta(tarjeta){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.pushItem(myCollection, tarjeta);
}

async function deleteTarjeta(filter = {}){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.deleteItem(myCollection, filter);
}

async function updateTarjeta(tarjeta){
    const connectionmongo = await connection.getConnection();
    const query = {_id: parseInt(tarjeta._id)};
    const newvalues = { $set : {
            user: tarjeta.user,
            nombre: tarjeta.nombre,
            descripcion: tarjeta.descripcion
        }
    };

    const result = await connectionmongo
                            .db(process.env.MONGODB_DB_NAME)
                            .collection(myCollection)
                            .updateOne(query, newvalues);
    return result;
}
module.exports = {getAllTarjetas, getTarjeta, pushTarjeta, deleteTarjeta, updateTarjeta }
