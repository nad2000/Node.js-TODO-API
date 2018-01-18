//const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");  // using 'destructuring'

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log(`Unable to connect to MongoDB server ${err}`);
  }
  console.log("Connected to MongoDB server");

  db.collection("Todos").find().toArray().then(docs => {
    console.log("All TODOs");
    console.log(JSON.stringify(docs, undefined, 2));
  }, err => {
    console.log("Unable to fetch todos", err);
  });

  // deleteMany
  db.collection("Todos").deleteMany({text: "Eat lunch"}).then(result => {
    console.log(result);
  });

  // deleteOne
  db.collection("Todos").deleteOne({text: "Eat lunch #2"}).then(result => {
    console.log(result);
  });

  // findOneAndDeleteOne
  db.collection("Todos").findOneAndDelete({completed: false}).then(result => {
    console.log(result);
  });
})
