const expect = require("expect")
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {
  app
} = require("../server");
const {
  Todo
} = require("../models/todo");

const todos = [{
  _id: ObjectID(),
  text: "First test todo"
}, {
  _id: ObjectID(),
  text: "Second test todo"
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    // insert some seed test data
    Todo.insertMany(todos);
  }).then(() => done());
});

describe("POST /todo", () => {

  it("shoud create a new todo", (done) => {
    var text = "TEST TODO TEXT";
    request(app)
      .post("/todos")
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({
          text
        }).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });
  });


  it("should not create a new todo with an invalid body", (done) => {
    request(app)
      .post("/todos")
      .send({
        text: ''
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.name).toBe("ValidationError");
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        }).catch(e => done(e));
      });
  });
});

describe("GET /todo", () => {

  it("should get all TODOs", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});


describe("GET /todo/:id", () => {

  it("should return a TODO", (done) => {
    var todo = todos[1];
    request(app)
      .get(`/todos/${todo._id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todo.text);
        expect(res.body.todo._id).toBe(todo._id.toString());
      })
      .end(done);
  });

  it("should return 404 if id doesn't exist", (done) => {
      //.end(done);
  });

  it("should return 404 for non-ObjectIDs", (done) => {
      //.end(done);
  });
});

