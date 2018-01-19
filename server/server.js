const express = require("express")
const bodyParser = require("body-parser");

var {mangoose} = require("./db/mongoose");
var {User} = require("./models/user");
var {Todo} = require("./models/todo");

function saveObj(o) {
  o.save().then(res => {
    console.log(`Saved obj:`);
    console.log(JSON.stringify(res, undefined, 2));
  }, e => {
    console.log(`Unable to save obj: ${e}`);
  });
}


var app = express();
app.use(bodyParser.json());
app.post("/todos", (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e);
  });
});

app.listen(3333, () => {
  console.log("Started on port 3333");
})
