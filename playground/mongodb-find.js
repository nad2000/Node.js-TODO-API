//const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");  // using 'destructuring'

// object destructuring:
var user = {name: "Rad", age: 42};
var {name} = user;
console.log(`Name: ${name}`);


var obj = new ObjectID();
console.log(obj, obj.getTimestamp());

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

  db.collection("Todos").find({
    _id: new ObjectID("5a6048ed66846113ae1f9533")
  }).toArray().then(docs => {
    console.log("A specific TODO");
    console.log(JSON.stringify(docs, undefined, 2));
  }, err => {
    console.log("Unable to fetch todos", err);
  });

  db.collection("Todos").find({completed: false}).toArray().then(docs => {
    console.log("Not-completed TODOs");
    console.log(JSON.stringify(docs, (k, v) => {
      if (k != "_id") return v;
    }, 2));
  }, err => {
    console.log("Unable to fetch todos", err);
  });

  db.collection("Todos").find().count().then(count => {
    console.log(`Total count ${count}`);
  }, err => {
    console.log("Unable to fetch todos", err);
  });

  db.close();
})
