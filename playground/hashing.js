const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

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

