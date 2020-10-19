const connection = require('./conexionMongo');

async function getUser(id){
    const connectionMongo = await connection.getConnection();
    console.log({connectionMongo});
    const user = await connectionMongo
                            .db('finanzapp')
                            .collection('users')
                            .findOne({_id: parseInt(id)});
    return user;
}

module.exports = {getUser}