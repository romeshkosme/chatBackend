const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

async function createHash(str) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(str, salt, function (err, hash) {
        if (err) {
          reject("Something went wrong!");
          return;
        }
        resolve(hash);
      });
    });
  });
}

async function compareHash(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      resolve(result);
    });
  });
}

async function createJwt(obj) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({ ...obj, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 }, "shhhhh");
    resolve(token)
  });
}

module.exports = { createHash, compareHash, createJwt };
