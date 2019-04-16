const handleErrors = require("../utils/handleErrors");
const jsYaml = require('js-yaml')
const fs = require('fs')
const inquirer = require("inquirer")

module.exports.command = "config-setup";
module.exports.describe =
    "Enters customizable configurations into config file";
module.exports.builder = (yargs) => yargs;
const CONFIG_URL = 'templates/infra-authentication-server/config/defaultroles.yml'

const questions = [
    {
      type: "confirm",
      name: "gauth",
      message:
        "Would you like to use Google Authentication for signing in?"
    },
    {
      type: "confirm",
      name: "gmail",
      message: "Would you like to use Gmail for password recovery?"
    },
    {
      type: "confirm",
      name: "sq",
      message: "Would you like to use a security question for password recovery?"
    }
];

let responses = ["", "", ""];

askQuestions = async () => {
    for(let i = 0; i < questions.length; i++){
        const response = await inquirer.prompt(questions[i])
        responses[i] = response[Object.keys(response)[0]]
    }
}

module.exports.handler = handleErrors(async (argv) => {
    try {
        console.log("Note that Google Authentication and Gmail both require setting up Google Oauth.")
        await askQuestions();
    } catch (e) {
    return console.error(e);
    }
    if (!responses[1] && !responses[2])
        return console.error("Please enable either Gmail or security questions.")
    const configInfo = await jsYaml.safeLoad(fs.readFileSync(CONFIG_URL, 'utf8'))
    configInfo.useGoogleAuth = responses[0]
    configInfo.gmail = responses[1]
    configInfo.security_question = responses[2]
    const yamlStr = jsYaml.safeDump({ ...configInfo })
    fs.writeFile(CONFIG_URL, yamlStr, (err) => {
        if (err) console.log(err, 'Something went wrong')
        else console.log('Success!')
    })
})