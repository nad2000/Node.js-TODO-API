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

var u = new User({
  email: "test@test.edu"
});

saveObj(u);

// var td = new Todo({
//   text: "Cook dinner"
// });

// saveObj(td);
// saveObj(
//   new Todo({
//     text: "Feed the cat",
//     completed: true,
//     completedAt: 123456
//   })
// );

// saveObj(
//   new Todo({
//     text: "       ",
//     completed: true,
//     completedAt: 123456
//   })
// );

