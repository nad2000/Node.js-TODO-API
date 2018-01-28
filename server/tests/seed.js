const {ObjectID} = require("mongodb");
const {Todo} = require("../models/todo");
const {User} = require("../models/user");
const jwt = require("jsonwebtoken");


const todos = [{
  _id: new ObjectID(),
  text: "First test todo"
}, {
  _id: new ObjectID(),
  text: "Second test todo",
  completed: true,
  completedAt: 42

}];

const populateTodos = done => {
  Todo.remove({}).then(() => {
    // insert some seed test data
    Todo.insertMany(todos);
  }).then(() => done());
};

const users = [{
  _id: new ObjectID(),
  email: "test123@test.com",
  password: "p455w0rd"
}, {
  _id: new ObjectID(),
  email: "jen@example.com",
  password: "userTwoPass"
}].map(u => {
  if (u.email == "test123@test.com")
    u.tokens = [{
      access: "auth",
      token: jwt.sign({
        _id: u._id,
        access: "auth"
      }, "abc123").toString()
    }];
  return u;
});

const populateUsers = done => {
  User.remove({}).then(() => {
    return Promise.all(users.map(u => new User(u).save()));
  }).then(() => done());
};

module.exports = {populateTodos, todos, populateUsers, users};
