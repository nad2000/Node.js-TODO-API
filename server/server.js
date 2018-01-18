const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

var Todo = mongoose.model("Todo", {
  text: {
    type: String,
    trim: true,
    minlength: 1,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number
  }
});


var User = mongoose.model("User", {
  email: {
    type: String,
    trim: true,
    minlength: 5,
    required: true
  }
});



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

