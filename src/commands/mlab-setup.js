const handleErrors = require("../utils/handleErrors");
const mongoose = require("mongoose")
const jsYaml = require('js-yaml')
const fs = require('fs')
const readline = require('readline')

module.exports.command = "mlab-setup";
module.exports.describe =
    "Enters mlab uri into config file";
module.exports.builder = (yargs) => yargs;

module.exports.handler = handleErrors(async (argv) => {
    let interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    console.log("Head over to https://mlab.com/ and make an account and a database.")
    console.log("Click on 'Create New' to create a new mongoDB deployment")
    console.log("Choose Amazon Web Services, Sandbox, us east, give the database a name, and submit the order.")
    console.log("Create  new user. It will tell you how to add the username and password for your user into a mLab URI")
    interface.question('Enter your mLab URI', async (uri) => {
        try {
            await mongoose.connect(uri, { useNewUrlParser: true })
            const configInfo = await jsYaml.safeLoad(fs.readFileSync('templates/infra-authentication-server/config/defaultroles.yml', 'utf8'))
            console.log(uri)
            configInfo.prodURI = String(uri)
            console.log(uri)
            const yamlStr = jsYaml.safeDump({ ...configInfo })
            await fs.writeFile('templates/infra-authentication-server/config/defaultroles.yml', yamlStr, (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log('Success!')
                    interface.close()
                    process.exit()
                }
            })
        } catch (e) {
            console.log(uri)
            console.log(e)
            console.log('Invalid URI or failure on mongoose\'s end!')
            interface.close()
            process.exit()
        }
    })
});
