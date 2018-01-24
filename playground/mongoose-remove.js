const express = require("express")
const bodyParser = require("body-parser");

var {mangoose} = require("../server/db/mongoose");
var {User} = require("../server/models/user");
var {Todo} = require("../server/models/todo");

var id = "5a62fd31d080dd0252245493";

// Todo.remove({}); -- remove everything
//Todo.remove({}).then(result => console.info(result));

// Todo.findOneAndRemove()...
Todo.findByIdAndRemove(id).then(
  todo => console.info(todo),
  err => console.error(err));

