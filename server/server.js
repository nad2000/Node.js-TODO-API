const express = require("express")
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

var {mangoose} = require("./db/mongoose");
var {User} = require("./models/user");
var {Todo} = require("./models/todo");

const port = process.env.PORT || 3333;

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
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e);
  });
});

app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => res.send({
      todos
    }),
    error => res.status(200).send({
      error
    })
  );
});

app.get("/todos/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: `Invalid ID ${id}`
    });
  }
  Todo.findById(id).then(
    todo => {
      if (!todo) {
        return res.status(404).send({
          error: `TODO with ID ${id} not found`
        });
      }
      res.send({
        todo
      });
    },
    error => res.status(400).send({
      error
    })
  )
});

app.delete("/todos/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: `Invalid ID ${id}`
    });
  }
  Todo.findByIdAndRemove(id).then(
    todo => {
      if (!todo) {
        return res.status(404).send({
          error: `TODO with ID ${id} not found`
        });
      }
      res.send({
        todo
      });
    },
    error => res.status(400).send({
      error
    })
  )
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
})

module.exports = {
  app
};

