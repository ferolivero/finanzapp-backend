const chalk = require('chalk');
const mongoclient = require('mongodb').MongoClient;
const dotenv = require('dotenv').config();
const uriMongodb = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_DOMAIN}/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`
const client = new mongoclient(uriMongodb, {useUnifiedTopology: true, useNewUrlParser: true});

async function getConnection(){
    return await client.connect().catch(err => console.log(chalk.red(err)));
}

module.exports = {getConnection};