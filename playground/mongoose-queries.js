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
