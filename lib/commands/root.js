const handleErrors = require("../utils/handleErrors");
const fs = require("fs");
const copy = require("recursive-copy");
const  { getProdURI } = require('../../templates/infra-authentication-server/src/utils/getConfigFile')
const User = require('../../templates/infra-authentication-server/src/models/User')
const mongoose = require("mongoose")

module.exports.command = "create-root [uname]";
module.exports.describe = 'creates root user with [name] and returns passwword'
module.exports.builder = (yargs) => yargs;

module.exports.handler = handleErrors(async (argv) => {
    // spin up the prod db
    // getUsers
    const uri = await getProdURI()
    if(!uri) {
      console.error('Unable to get uri from config yaml file')
      return
    }
  console.log(uri)
  const resp = await mongoose.connect(uri, { useNewUrlParser: true });
  console.log(resp, 'connected')
  try {
    console.log("cgvgh")
  const resp = await User.find()
console.log("cgvgh")
  } catch(e) {
    console.log(e)
  }    
  });