const expect = require("expect")
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("../server");
const {Todo} = require("../models/todo");
const {User} = require("../models/user");
const {populateTodos, populateUsers, todos, users} = require("./seed");

beforeEach(populateUsers);
beforeEach(populateTodos);


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
        expect(res.body.todo._id).toBe(todo._id.toHexString());
      })
      .end(done);
  });

  it("should return 404 if id doesn't exist", (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-ObjectIDs", (done) => {
    request(app)
      .get("/todos/INVALID_TODO_ID")
      .expect(404)
      .end(done);
  });

});

describe("DELETE /todo/:id", () => {

  it("should remove a TODO", (done) => {
    var todo = todos[1];
    request(app)
      .delete(`/todos/${todo._id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todo.text);
        expect(res.body.todo._id).toBe(todo._id.toHexString());
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todo._id).then(todo => {
          expect(todo).toNotExist();
          done();
        }).catch(e => done(e));
      });
  });

  it("should return 404 if id doesn't exist", (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-ObjectIDs", (done) => {
    request(app)
      .delete("/todos/INVALID_TODO_ID")
      .expect(404)
      .end(done);
  });

});

describe("PATCH /todo/:id", () => {

  it("should update the TODO", (done) => {
    var todo = todos[0];
    request(app)
      .patch(`/todos/${todo._id}`)
      .send({
        text: "NEW TEXT",
        completed: true
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe("NEW TEXT");
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA("number");
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todo._id).then(todo => {
          expect(todo.text).toBe("NEW TEXT");
          expect(todo.completed).toBe(true);
          expect(todo.completedAt).toBeA("number");
          done();
        }).catch(e => done(e));
      });
  });

  it("should clear completedAt when TODO is not completed.", (done) => {
    var todo = todos[1];
    request(app)
      .patch(`/todos/${todo._id}`)
      .send({
        completed: false
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todo._id).then(todo => {
          expect(todo.completed).toBe(false);
          expect(todo.completedAt).toNotExist();
          done();
        }).catch(e => done(e));
      });
  });

});

describe("GET /users/me", () => {

  it("shoud return a user if is authenticated", done => {
    request(app)
      .get("/users/me")
      .set("X-Auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).end(done);
  });

  it("should return 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      }).end(done);
  });

});


describe("POST /users", () => {

  it("shoud create a user", done => {
    var email = "example@example.com"
    var password = "123mnb!";
    request(app)
      .post("/users")
      .send({
        email,
        password
      })
      .expect(200)
      .expect(res => {
        // console.log(JSON.stringify(res, undefined, 2));
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      }).end(err => {
        if (err) return done(err);
        User.findOne({
          email
        }).then(user => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch(e => done(e));
      });
  });

  it("should return validation error if request is invalid", done => {
    var email = "example_example.com"
    var password = "123mnb!";
    request(app)
      .post("/users")
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });

  it("should not create user if email is use", done => {
    var {email} = users[0];
    var password = "123mnb!";
    request(app)
    request(app)
      .post("/users")
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });

});

describe("POST /users/login", () => {

  it("shoud login a user", done => {
    var {
      email,
      password,
      _id
    } = users[1];
    request(app)
      .post("/users/login")
      .send({email, password})
      .expect(200)
      .expect(res => {
        //console.log(JSON.stringify(res.body, undefined, 2));
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      }).end((err, res) => {
        if (err) return done(err);
        var token = res.headers["x-auth"];
        User.findById(_id).then(user => {
          expect(user.tokens[0]).toInclude({
            access: "auth",
            token: res.headers["x-auth"]
          });
          done();
        }).catch(e => done(e));
      });
  });

  it("should reject invalid login", done => {
    var {email} = users[0];
    var password = "INCORRECT";
    request(app)
      .post("/users/login")
      .send({email, password})
      .expect(401)
      .expect(res => {
        expect(res.headers["x-auth"]).toNotExist();
      }).end(done);
  });

});


