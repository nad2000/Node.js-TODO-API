const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var message = "I am user number 3";
var hash = SHA256(message).toString();

console.log(`Messge: ${message}`);
console.log(`Hash: ${hash}`);

var data = {
  id: 4
};
var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

token.data.id = 5;

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash == token.hash) {
  console.log("Data was not changed");
} else {
  console.log("Data was changed. Do not trust!");
}


///////////////////////////////////

var token = jwt.sign(data, "123abc");
console.log(token.toString());


var decoded = jwt.verify(token, "123abc");
console.log("DECODED:", decoded);


var password = "p455w0rd!!!"

//
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(`SALT: ${salt}, HASH: ${hash}`);
  });
});

var hashedPassword = "$2a$10$g0doEMS/EvhB4JAqRAFSUuzX9WLI1VdjhVRgBZObW6nqOfO/qLuUW";
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
bcrypt.compare("abc123", hashedPassword, (err, res) => {
  console.log(res);
});
