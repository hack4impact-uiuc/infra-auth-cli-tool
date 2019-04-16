const handleErrors = require("../utils/handleErrors");
const jsYaml = require('js-yaml')
const fs = require('fs')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

module.exports.command = "config-setup";
module.exports.describe =
    "Enters customizable configurations into config file";
module.exports.builder = (yargs) => yargs;

module.exports.handler = handleErrors(async (argv) => {
    console.log('Note that Google Authentication and Gmail both require setting up Google Oauth.')
    readline.question('Would you like to use Google Authentication for signing in? (yes/no):\n', async (choice1) => {
        const c1 = choice1.toLowerCase()
        if (c1 !== 'yes' && c1 !== 'no') {
            return console.error("Invalid response. Please run again.")
        }
        console.log('Note that you should enable Gmail, security questions, or both for password recovery.')
        readline.question('Would you like to use Gmail for password recovery? (yes/no): ', async (choice2) => {
            const c2 = choice2.toLowerCase()
            if (c2 !== 'yes' && c2 !== 'no') {
                return console.error("Invalid response. Please run again.")
            }
            readline.question('Would you like to use a security question for password recovery? (yes/no): ', async (choice3) => {
                const c3 = choice3.toLowerCase()
                if (c3 !== 'yes' && c3 !== 'no') {
                    return console.error("Invalid response. Please run again.")
                }
                if(c2 === 'no' && c3 === 'no') {
                    return console.error("Please enable either Gmail or security questions.")
                }
                const configInfo = await jsYaml.safeLoad(fs.readFileSync('templates/infra-authentication-server/config/defaultroles.yml', 'utf8'))
                configInfo.useGoogleAuth = c1 == "yes" ? true : false
                configInfo.gmail = c2 == "yes" ? true : false
                configInfo.security_question = c3 == "yes" ? true : false
                const yamlStr = jsYaml.safeDump({ ...configInfo })
                fs.writeFile('templates/infra-authentication-server/config/defaultroles.yml', yamlStr, (err) => {
                    if (err) console.log(err, 'something went wrong')
                    else console.log('Success!')
                })
                readline.close()
            })
        })
    })
})