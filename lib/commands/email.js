//      
const handleErrors = require("../utils/handleErrors");
const fs = require("fs");
const copy = require("recursive-copy");
const inquirer = require("inquirer");

module.exports.command = "email";
module.exports.describe = "Sets up the email tokens to use Gmail.";
module.exports.builder = (yargs     ) => yargs;
const CREDENTIALS_PATH = '../../../credentials.json';

var questions = [
  {
    type: "confirm",
    name: "gmail_setup",
    message:
      "Welcome to the setup!\nBefore preceding, have you set up a Gmail account?"
  },
  {
    type: "confirm",
    name: "below_url",
    message:
      'Navigate to the below URL.\n In step 1, please hit the big "Enable The Gmail API" button. \nhttps://developers.google.com/gmail/api/quickstart/nodejs\n Continue?'
  },
  {
    type: "confirm",
    name: "client_config",
    message:
      'Click the big "Download Client Configuration" button. \n Save/copy this file into the root directory.\n Is this done?'
  }
];

module.exports.handler = handleErrors(async (argv    ) => {
  console.info("");
  await inquirer.prompt(questions);
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.log("Can't ")
    // Do something
    return;
  }

  console.log("Copying into directory...");
  
  fs.createReadStream('../../../credentials.json').pipe(fs.createWriteStream('credentials.json'));

});
