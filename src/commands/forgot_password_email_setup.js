const handleErrors = require("../utils/handleErrors");
const jsYaml = require('js-yaml')
const fs = require('fs')
const inquirer = require("inquirer")

module.exports.command = "forgot_password_email_setup";
module.exports.describe =
    "Enters customizable configurations into config file";
module.exports.builder = (yargs) => yargs;

const questions = [
    {
      type: "confirm",
      name: "gauth",
      message:
        "Would you like to use Google Authentication for signing in?"
    },
    {
      type: "rawlist",
      name: "password",
      message: "How would you like to handle password recovery?",
      choices: ["Gmail", "Security Question", "Both"]
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
    const configUrl = `${process.cwd()}/config/defaultroles.yml`
    try {
        console.log("Note that Google Authentication and Gmail both require setting up Google Oauth.")
        await askQuestions();
    } catch (e) {
    return console.error(e);
    }
    if (responses[1] == "Gmail") {
        responses[1] = true
        responses[2] = false
    }
    else if (responses[1] == "Security Question") {
        responses[1] = false
        responses[2] = true
    }
    else {
        responses[1] = true
        responses[2] = true
    }
    const configInfo = await jsYaml.safeLoad(fs.readFileSync(configUrl, 'utf8'))
    configInfo.useGoogleAuth = responses[0]
    configInfo.gmail = responses[1]
    configInfo.security_question = responses[2]

    const yamlStr = jsYaml.safeDump({ ...configInfo })

    fs.writeFile(configUrl, yamlStr, (err) => {
        if (err) console.log(err, 'Something went wrong')
        else console.log('Success!')
    })
})