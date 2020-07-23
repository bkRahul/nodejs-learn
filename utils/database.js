const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (cb) => {
  const uri =
    "mongodb+srv://rahul:root@nodejs-learn.ffvda.mongodb.net/<dbname>?retryWrites=true&w=majority";

  MongoClient.connect(uri, { useNewUrlParser: true })
    .then((client) => {
      console.log("connected to mongodb");
      cb(client);
    })
    .catch((err) => {
      console.log("could not connect to mongo db", err);
    });
};

module.exports = mongoConnect;
