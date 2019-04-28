const handleErrors = require("../utils/handleErrors");
const jsYaml = require('js-yaml')
const fs = require('fs')
const inquirer = require("inquirer")
module.exports.command = "security-questions-setup";
module.exports.describe =
    "Customize security questions";
module.exports.builder = (yargs) => yargs;

let questions = ['What was your favorite sport in high school?', 'Who is your childhood sports hero?', 'What is your favorite movie?', 'What school did you attend for sixth grade?', 'In what town was your first job?']

setQuestions = async () => {
    let question_choices = ["Add a question", "Delete a question", "Finish"]

    let creatingQuestions = true
    while (creatingQuestions) {
        const response = await inquirer
            .prompt({
                type: "list",
                name: "security_question",
                message:
                    "The current security questions available are \n  " + questions.map((question) => question).join("     \n  ") + "\n What would you like to do.",
                choices: question_choices
            })
        if (response["security_question"] === question_choices[0]) {
            const second_response = await inquirer.prompt({
                name: 'add',
                message: "What is the question you would like to add?",
            });
            questions.push(second_response['add'])
        }
        if (response["security_question"] === question_choices[1]) {

            const second_response = await inquirer.prompt({
                type: 'list',
                name: 'delete',
                message: "What role would you like to delete",
                choices: questions
            });
            questions.splice(questions.indexOf(second_response['delete']),1)
        }
        if (response["security_question"] === question_choices[2]) {
            creatingQuestions = false
        }
    }
}



module.exports.handler = handleErrors(async (argv) => {
    try {
        await setQuestions();
    } catch (e) {
        return console.error(e);
    }
    const configInfo = await jsYaml.safeLoad(fs.readFileSync('templates/infra-authentication-server/config/defaultroles.yml', 'utf8'))
    configInfo["security_questions"] = questions
    const yamlStr = jsYaml.safeDump({ ...configInfo })
    await fs.writeFile('templates/infra-authentication-server/config/defaultroles.yml', yamlStr, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('Success!\n')
        }
    })
})