const connection = require('./conexionMongo');

async function getUser(id){
    console.log('User:', id)
    const connectionmongo = await connection.getConnection();
    console.log('MongoDB Connection:', connectionmongo);
    const user = await connectionmongo
                            .db('finanzapp')
                            .collection('users')
                            .findOne({_id: parseInt(id)});
    return user;
}

async function getAllInventors(){
    //return await readMocInventor();
    const connectionmongo = await connection.getConnection();

    const inventors = await connectionmongo
                        .db('sample_betp2')
                        .collection('inventors').
                        find().
                        toArray();
    
    return inventors;
}

module.exports = {getUser}