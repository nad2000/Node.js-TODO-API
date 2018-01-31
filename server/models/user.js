const _ = require("lodash");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
});

// Use mongoose middleware:
UserSchema.pre("save", function (next) { // user regural function to access 'this'
  if (this.isModified("password"))
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next();
      });
    });
  else {
    next();
  }
});


// override the serialization of User
UserSchema.methods.toJSON = function() {
  return _.pick(this.toObject(), ["_id", "email", ]);
};

UserSchema.statics.findByCredentials = function(email, password) {
  return this.findOne({
    email
  }).then(user => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => bcrypt.compare(password, user.password, (err, res) => {
      if (res) resolve(user);
      if (err) reject(err);
      else reject();
    }));
  });
}


UserSchema.statics.findByToken = function(token) {
  try {
    var decoded = jwt.verify(token, "abc123");
    return User.findOne({
      _id: decoded._id,
      "tokens.token": token,
      "tokens.access": "auth"
    });
  } catch (e) {
    return Promise.reject();
  };
}
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

// define instance methods:
UserSchema.methods.removeToken = function(token) {
  return this.update({
    $pull: {  // '$pull' useful fro modifying arrays
      tokens: {
        token: token
      }
    }
  });
};

var User = mongoose.model("User", UserSchema);

module.exports = {
  User
};

