//const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");  // using 'destructuring'

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log(`Unable to connect to MongoDB server ${err}`);
  }
  console.log("Connected to MongoDB server");
  //
  // findOneAndUpdate
  db.collection("Todos").findOneAndUpdate(
    {completed: false, text: "Eat lunch"},
    {
      $set: {completed: true}
    },
    {
      returnOriginal: false
    }).then(result => {
    console.log(result);
  });
})
