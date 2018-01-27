const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// need to user schema to defie new methods
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    minlength: 5,
    required: true,
    unique: true,
    validate: { // a custom validator
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email."
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

// define instance methods:
UserSchema.methods.generateAuthToken = function() {
  var access = "auth";
  var token = jwt.sign({
    _id: this._id.toHexString(),
    access
  }, "abc123");
  this.tokens.push({
    access,
    token
  });
  // return the promise:
  return this.save().then(() => token);
};

var User = mongoose.model("User", UserSchema);

module.exports = {
  User
};

