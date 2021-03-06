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

  db.collection("Todos").insertOne({
  }, (err, result) => {
    if (err) {
      return console.log(`Unable to insert todo ${err}`);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());  // object ID embeds timestamp
  });

  db.close();
})
