// const dotenv = require('dotenv').config();
const chalk = require('chalk');
const MongoClient = require('mongodb').MongoClient;

const uriMongodb = "mongodb+srv://finanzapp:yCa52mC3AeTTRuod@cluster0.09ljz.mongodb.net/finanzapp?retryWrites=true&w=majority";
// console.log(String(uriMongoDb));
const client = new MongoClient(uriMongodb, {useUnifiedTopology: true, useNewUrlParser: true});

async function getConnection(){
    console.log(uriMongodb);
    return await client.connect().catch(err => console.log(chalk.red(err)));
}

//mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb://finanzapp_user:Pa$$word1@cluster0.09ljz.mongodb.net/finanzapp";
// const uri = "mongodb+srv://finanzapp_user:Pa$$word1@cluster0.09ljz.mongodb.net/finanzapp?retryWrites=true&w=majority";
// console.log(uri);
// const client = new MongoClient(uri);
// await client.connect();
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


// async function getConnection(){
//   /**
//    * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//    * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
//    */
//   // const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
//   const uriMongodb = "mongodb+srv://finanzapp:yCa52mC3AeTTRuod@cluster0.09ljz.mongodb.net/finanzapp?retryWrites=true&w=majority";


//   const client = new MongoClient(uri);

//   try {
//       // Connect to the MongoDB cluster
//       await client.connect();

//       // Make the appropriate DB calls
//       await  listDatabases(client);

//   } catch (e) {
//       console.error(e);
//   } finally {
//       await client.close();
//   }
// }

// getConnection().catch(console.error);

module.exports = { getConnection };