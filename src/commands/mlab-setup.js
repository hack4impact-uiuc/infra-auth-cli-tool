const handleErrors = require("../utils/handleErrors");
const mongoose = require("mongoose")
const jsYaml = require('js-yaml')
const fs = require('fs')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

module.exports.command = "mlab-setup";
module.exports.describe =
    "Enters mlab uri into config file";
module.exports.builder = (yargs) => yargs;

module.exports.handler = handleErrors(async (argv) => {
    console.log('Enter mLab URI!...')
    readline.question('What is the URI of the DB?', async (uri) => {
        try {
            await mongoose.connect(uri, { useNewUrlParser: true })
            const configInfo = await jsYaml.safeLoad(fs.readFileSync('templates/infra-authentication-server/config/defaultroles.yml', 'utf8'))
            configInfo.prodURI = uri
            const yamlStr = jsYaml.safeDump({ ...configInfo })
            fs.writeFile('templates/infra-authentication-server/config/defaultroles.yml', yamlStr, (err) => {
                if (err) console.log(err, 'something went wrong')
                else console.log('Success!')
            })
        } catch (e) {
            console.log('Invalid URI or failure on mongoose\'s end!')
        }
        readline.close()
    })
});
