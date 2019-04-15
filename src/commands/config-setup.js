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
    readline.question('Would you like to use Google Authentication for signing in? (yes/no)', async (choice) => {
        const configInfo = await jsYaml.safeLoad(fs.readFileSync('templates/infra-authentication-server/config/defaultroles.yml', 'utf8'))
        configInfo.useGoogleAuth = choice.toLowerCase() == "yes" ? true : false
        const yamlStr = jsYaml.safeDump({ ...configInfo })
        fs.writeFile('templates/infra-authentication-server/config/defaultroles.yml', yamlStr, (err) => {
            if (err) console.log(err, 'something went wrong')
            else console.log('Success!')
        })
        readline.close()
    })
    console.log('Note that you should enable Gmail, security questions, or both for password recovery.')
    console.log('Would you like to use Gmail for password recovery? (yes/no)')
    readline.question('',
     async (choice) => {
        const configInfo = await jsYaml.safeLoad(fs.readFileSync('templates/infra-authentication-server/config/defaultroles.yml', 'utf8'))
        configInfo.gmail = choice == "yes" ? true : false
        const yamlStr = jsYaml.safeDump({ ...configInfo })
        fs.writeFile('templates/infra-authentication-server/config/defaultroles.yml', yamlStr, (err) => {
            if (err) console.log(err, 'something went wrong')
            else console.log('Success!')
        })
        readline.close()
    })
    readline.question('Would you like to use a security question for password recovery? (yes/no)', async (choice) => {
        const configInfo = await jsYaml.safeLoad(fs.readFileSync('templates/infra-authentication-server/config/defaultroles.yml', 'utf8'))
        configInfo.security_question = choice == "yes" ? true : false
        const yamlStr = jsYaml.safeDump({ ...configInfo })
        fs.writeFile('templates/infra-authentication-server/config/defaultroles.yml', yamlStr, (err) => {
            if (err) console.log(err, 'something went wrong')
            else console.log('Success!')
        })
        readline.close()
    })
});