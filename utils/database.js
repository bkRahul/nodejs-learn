const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const uri =
  "mongodb+srv://rahul:root@nodejs-learn.ffvda.mongodb.net/shop?retryWrites=true&w=majority";

//start a connection  
const mongoConnect = (cb) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
      console.log("connected to mongodb");
      _db = client.db();
      cb();
    })
    .catch((err) => {
      console.log("could not connect to mongo db", err);
    });
};

//get database info
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
