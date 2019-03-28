const handleErrors = require("../utils/handleErrors");
const fs = require("fs");
const copy = require("recursive-copy");
const {
  getProdURI
} = require("../../templates/infra-authentication-server/src/utils/getConfigFile");
const User = require("../../templates/infra-authentication-server/src/models/User");
const mongoose = require("mongoose");

module.exports.command = "create-root [email]";
module.exports.describe =
  "creates root user with [email] and returns passwword";
module.exports.builder = yargs => yargs;

module.exports.handler = handleErrors(async argv => {
  // spin up the prod db
  // getUsers
  const uri = await getProdURI();

  if (!uri) {
    console.error("Unable to get uri from config yaml file");
    return;
  }
  await mongoose.connect(uri, { useNewUrlParser: true });
  if(!validateEmail(argv.email)) {
    console.info('invalid email: ', argv.email)
    return
  }
  const rootUsers = await User.find({ role: "root"});
  if (!!rootUsers.length) {
    console.error(
      "there is someone with root privileges",
      rootUsers
    );
    return;
  }
  const emailUsers = await User.find({ email: argv.email});
  if (!!emailUsers.length) {
    console.error(
      "there is someone with the same email",
      emailUsers
    );
    return;
  }
  const randomPassword = generatePassword();
  const userData = {
    email: argv.email,
    password: randomPassword,
    role: 'root',
    verified: false
  };
  const user = new User(userData);
  try {
    await user.save();
    console.info(
      "user created",
      `password: ${randomPassword}`,
      `email: ${argv.email}`
    );
  } catch (e) {
    console.error(e, "there was an error creating the user");
  }
});


const generatePassword = () => {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}