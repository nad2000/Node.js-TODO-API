const {User} = require("../models/user");

// middle-ware authentication function:
var authenticate = (req, res, next) => {
  var token = req.header("X-Auth");

  User.findByToken(token).then(user => {
    if (!user) return Promise.reject();
    // res.send(user);
    req.user = user;
    req.token = token;
    next();
  }).catch(error => res.status(401).send());
};


module.exports = {authenticate};
