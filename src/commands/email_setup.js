// @flow
const handleErrors = require("../utils/handleErrors");
const fs = require("fs");
const copy = require("recursive-copy");
const inquirer = require("inquirer");
const execPromise = require("../utils/execPromise");
const asyncReadFile = require("../utils/asyncReadFile");

module.exports.command = "email_setup";
module.exports.describe = "Sets up the email tokens to use Gmail.";
module.exports.builder = (yargs: any) => yargs;
const CREDENTIALS_PATH = "./credentials.json";

const questions = [
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

const final_question = [
  {
    type: "text",
    name: "email_used",
    message: "Great! What email did you use to set this up?"
  }
];
handleYesNoQuestions = async () => {
  for (let i = 0; i < questions.length; i++) {
    const response = await inquirer.prompt(questions[i]);
    // get first value in object ex. {"gmail_setup": false} and access its boolean value
    if (!response[Object.keys(response)[0]]) {
      throw "Exiting setup...";
    }
  }
};
module.exports.handler = handleErrors(async (argv: {}) => {
  try {
    await handleYesNoQuestions();
  } catch (e) {
    return console.error(e);
  }
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error("Can't find file: credentials.json in root directory");
    return;
  }

  fs.createReadStream(CREDENTIALS_PATH).pipe(
    fs.createWriteStream("src/utils/credentials.json")
  );
  const gmailCreateFile = `${process.cwd()}/src/utils/gmail_create.js`
  await execPromise("node", [gmailCreateFile], {
    cwd: "src/utils",
    stdio: "inherit"
  });

  const { email_used } = await inquirer.prompt(final_question);

  let tokens;
  let credentials;
  try {
    tokens = JSON.parse(await asyncReadFile("src/utils/token.json"));
  } catch (e) {
    console.error(e);
    console.error("There was a problem reading your token.json file.");
    return;
  }
  try {
    credentials = JSON.parse(await asyncReadFile("src/utils/credentials.json"));
  } catch (e) {
    console.error("There was a problem reading your credentials.json file.");
    return;
  }
  console.log(
    "\n\nExcellent! You are ready to go! Here's your last task: copy the information below into a .env file in your root directory of your project. You are now all set to use email!\n"
  );
  console.log(`INFRA_EMAIL='${email_used}'`);
  console.log(`INFRA_CLIENT_ID='${credentials.installed.client_id}'`);
  console.log(`INFRA_CLIENT_SECRET='${credentials.installed.client_secret}'`);
  console.log(`INFRA_REFRESH_TOKEN='${tokens.refresh_token}'`);
  //TODO: Make it write to the file
});
