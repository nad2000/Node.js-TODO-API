const express = require("express")
const bodyParser = require("body-parser");

var {mangoose} = require("../server/db/mongoose");
var {User} = require("../server/models/user");
var {Todo} = require("../server/models/todo");

var id = "5a62fd31d080dd0252245493";

Todo.find({
  _id: id
}).then(todos => console.log("FIND:", todos));


Todo.findOne({
  _id: id
}).then(todo => console.log("FIND ONE:", todo));

Todo.findById(id).then(todo => console.log("FIND BY ID:", todo));


var invalidId = "5a62fd31d080dd0252245493111111";

Todo.findById(invalidId).then(todo => console.log("FIND BY ID:", todo))
  .catch(e => console.log(e));

const {ObjectID} = require("mongodb");
if (!ObjectID.isValid(invalidId)) {
  console.log(`ERROR: the id ${invalidId} is not valid.`);
}

var userID = "5a61a5445a9d237224288ac9";
User.findById(userID).then(user => {
    if (!user) {
      return console.log(`ID ${userID} not found`);
    }
    console.log(JSON.stringify(user, undefined, 2));
  },
  e => console.error(e));

