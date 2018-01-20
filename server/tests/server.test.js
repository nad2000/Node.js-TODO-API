const expect = require("expect")
const request = require("supertest");

const {
  app
} = require("../server");
const {
  Todo
} = require("../models/todo");

const todos = [{
  text: "First test todo"
}, {
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


  it("shoud not create a new todo with an invalid body", (done) => {
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

  it("shoud get all TODOs", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

