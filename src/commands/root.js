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
  console.log(uri);
  const resp = await mongoose.connect(uri, { useNewUrlParser: true });

  const rootUsers = await User.find({ role: "root"});
  // if (!!rootUsers.length) {
  //   console.error(
  //     "there is someone with root privileges",
  //     rootUsers
  //   );
  //   return;
  // }
  const emailUsers = await User.find({ email: argv.email});
  if (!!emailUsers.length) {
    console.error(
      "there is someone with the same email",
      emailUsers
    );
    return;
  }
  const randomPassword = "nits";
  const userData = {
    email: argv.email,
    password: randomPassword,
    role: 'root',
    verified: false
  };
  const user = new User(userData);
  try {
    await user.save();
    console.log(
      "user created",
      "---------",
      `password: ${randomPassword}`,
      `email: ${argv.email}`
    );
  } catch (e) {
    console.error(e, "there was an error creating the user");
  }
});
