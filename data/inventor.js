// mongodb+srv://admin:tp2a@cluster0.uak9i.mongodb.net/sample_betp2?retryWrites=true&w=majority

const fs = require('fs').promises;
const PATHMOCINVENTORS = __dirname + '/mocInventor.json';
const connection = require('./conexionMongo');

async function readMocInventor(){
   return JSON.parse(await fs.readFile(PATHMOCINVENTORS, 'utf8'));
}

async function writeMocInventor(inventors){
    await fs.writeFile(PATHMOCINVENTORS, JSON.stringify(inventors, null, ' '));
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

async function getInventor(id){
    // let data = await getAllInventors();
    // let inventor = data.inventors.find(inventor => inventor._id == id);
    // return  inventor;
    const connectionmongo = await connection.getConnection();

    const inventor = await connectionmongo
                            .db('sample_betp2')
                            .collection('inventors')
                            .findOne({_id: parseInt(id)});
    return inventor;
}

async function pushInventor(inventor){
    // let data = await getAllInventors();
    // data.inventors.push(inventor);
    // await writeMocInventor(data);
    const connectionmongo = await connection.getConnection();

    const result = await connectionmongo
                            .db('sample_betp2')
                            .collection('inventors')
                            .insertOne(inventor);
    return result;
}

async function updateInventor(inventor){
    // const data  = await getAllInventors();
    // const index = data.inventors.findIndex(value => value._id == inventor._id);
    // data.inventors[index].first = inventor.first;
    // data.inventors[index].last = inventor.last;
    // data.inventors[index].year = inventor.year;
    // data.inventors[index].img = inventor.img;

    // await writeMocInventor(data);
    const connectionmongo = await connection.getConnection();
    const query = {_id: parseInt(inventor._id)};
    const newvalues = { $set : {
            first: inventor.first,
            last: inventor.last,
            year: inventor.year,
            img: inventor.img            
        }
    };

    const result = await connectionmongo
                            .db('sample_betp2')
                            .collection('inventors')
                            .updateOne(query, newvalues);
    return result;
}

async function deleteInventor(id){
    // const data = await getAllInventors();
    // data.inventors.splice(
    //     data.inventors.findIndex(value => value._id == id), 
    //     1
    // );
    // await writeMocInventor(data);
    const connectionmongo = await connection.getConnection();
    const result = await connectionmongo
                            .db('sample_betp2')
                            .collection('inventors')
                            .deleteOne({_id: parseInt(id)});
    return result;
}

module.exports = {getAllInventors, getInventor, pushInventor, updateInventor, deleteInventor}