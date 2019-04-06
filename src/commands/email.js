// @flow
const handleErrors = require("../utils/handleErrors");
const fs = require("fs");
const copy = require("recursive-copy");
const inquirer = require("inquirer");
const execPromise = require("../utils/execPromise");

module.exports.command = "email";
module.exports.describe = "Sets up the email tokens to use Gmail.";
module.exports.builder = (yargs: any) => yargs;
const CREDENTIALS_PATH = "./credentials.json";

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

handleYesNoQuestions = async () => {
  for(let i = 0; i < questions.length; i++){
      const response = await inquirer.prompt(questions[i]);
      console.log("Done");
      // get first value in object ex. {"gmail_setup": false} and access its boolean value
      if(!response[Object.keys(response)[0]]){
        throw "Exiting setup...";
      }
  }
}
module.exports.handler = handleErrors(async (argv: {}) => {
  try {
    await handleYesNoQuestions();
  } catch(e){
    return console.error(e);
  }
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error("Can't find file: credentials.json in root directory");
    // Do something
    return;
  }

  console.log("Copying into directory...");

  fs.createReadStream(CREDENTIALS_PATH).pipe(
    fs.createWriteStream("src/utils/credentials.json")
  );
  await execPromise("node", ["gmail_create.js"], {
    cwd: "src/utils",
    stdio: "inherit"
  });
  console.log("Here");
});
