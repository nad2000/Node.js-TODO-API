const {ObjectID} = require("mongodb");
const {Todo} = require("../models/todo");
const {User} = require("../models/user");

const todos = [{
  _id: ObjectID(),
  text: "First test todo"
}, {
  _id: ObjectID(),
  text: "Second test todo",
  completed: true,
  completedAt: 42

}];

const populateTodos = done => {
  Todo.remove({}).then(() => {
    // insert some seed test data
    Todo.insertMany(todos);
  }).then(() => {
    User.remove({});
  }).then(() => done());
};

module.exports = {populateTodos, todos};
