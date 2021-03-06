require("./config/config");
const _ = require("lodash");
const express = require("express")
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

const {mangoose} = require("./db/mongoose");
const {User} = require("./models/user");
const {Todo} = require("./models/todo");
const {authenticate} = require("./middleware/authenticate");

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

app.post("/todos", authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e);
  });
});

app.get("/todos", authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(
    todos => res.send({
      todos
    }),
    error => res.status(200).send({
      error
    })
  );
});


app.get("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: `Invalid ID ${id}`
    });
  }
  Todo.findOne({_id: id, _creator: req.user.id}).then(
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

app.delete("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: `Invalid ID ${id}`
    });
  }
  Todo.findOneAndRemove({_id: id, _creator: req.user.id}).then(
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

app.patch("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: `Invalid ID ${id}`
    });
  }
  var body = _.pick(req.body, ["text", "completed", ]); // pick takes only specific elements
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findOneAndUpdate({_id: id, _creator: req.user.id}, {
    $set: body
  }, {
    new: true
  }).then(
    todo => {
      if (!todo) {
        return res.status(404).send({
          error: `TODO with ID ${id} not found`
        });
      }
      res.send({todo});
    }).catch(error => res.status(400).send({
    error
  }));
});


app.get("/users/me", authenticate, (req, res) => res.send(req.user));

// POST /users
app.post("/users", (req, res) => {

  var body = _.pick(req.body, ["email", "password", ]);
  var user = new User(body);

  user.save().then(user => user.generateAuthToken()).then(
      token => res.header("X-Auth", token)
      .send(user))
    .catch(e => res.status(400).send({error: e}));
});

// POST /users
app.post("/users/login", (req, res) => {

  var {email, password} = _.pick(req.body, ["email", "password", ]);

  User.findByCredentials(email, password).then(user => {
    return user.generateAuthToken().then(token => {
      res.header("X-Auth", token).send(user);
    });
  })
    .catch(e => res.status(401).send({
      error: e
    }));
});

// POST /users
app.delete("/users/me/token", authenticate, (req, res) => {

  req.user.removeToken(req.token).then(() => {
      res.status(200).send()
    },
    () => {
      res.status(400).send();
    });;
});



app.listen(port, () => {
  console.log(`Started on port ${port}`);
})

module.exports = {
  app
};

