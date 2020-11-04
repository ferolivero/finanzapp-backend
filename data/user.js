const abm = require('./abm');

//ACÁ VA EL NOMBRE DE LA COLECCION CON LA QUE VAMOS A TRABAJAR
const myCollection = 'users';

async function getUsuario(id){
    console.log(id);
    //ACA PODRIA IR UNA LOGICA PROPIA
    
    return await abm.getItemById(myCollection, {id: id});
}

async function pushUsuario(usuario){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.pushItem(myCollection, usuario);
}

async function deleteUsuario(id){
    //ACA PODRIA IR UNA LOGICA PROPIA
    return await abm.deleteItem(myCollection, {id: id});
}

module.exports = {getUsuario, pushUsuario, deleteUsuario }