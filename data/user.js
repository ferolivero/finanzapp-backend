const abm = require('./abm');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'users';

async function getUsuario(filter = {}){
    return await abm.getItemById(myCollection, filter);
}

async function pushUsuario(usuario){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.pushItem(myCollection, usuario);
}

async function deleteUsuario(filter = {}){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.deleteItem(myCollection, filter);
}

module.exports = {getUsuario, pushUsuario, deleteUsuario }