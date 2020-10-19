const chalk = require('chalk');
const mongoclient = require('mongodb').MongoClient;
const dotenv = require('dotenv').config();

// const uriMongodb = 'mongodb+srv://admin:tp2a@cluster0.uak9i.mongodb.net/sample_betp2?retryWrites=true&w=majority';
const uriMongodb = "mongodb+srv://finanzapp:yCa52mC3AeTTRuod@cluster0.09ljz.mongodb.net/finanzapp?retryWrites=true&w=majority";

const client = new mongoclient(uriMongodb, {useUnifiedTopology: true, useNewUrlParser: true});

async function getConnection(){
    return await client.connect().catch(err => console.log(chalk.red(err)));
}

module.exports = {getConnection};