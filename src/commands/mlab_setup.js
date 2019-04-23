// @flow
const handleErrors = require("../utils/handleErrors");
const fs = require("fs");
const inquirer = require("inquirer");
const mongoose = require("mongoose")


module.exports.command = "mlab_setup";
module.exports.describe =
    "Setup the prod uri for mlab";
module.exports.builder = (yargs: any) => yargs;

module.exports.handler = handleErrors(async (argv: {}) => {
    console.log("Head over to https://mlab.com/ and make an account and a database.")
    console.log("Click on 'Create New' to create a new mongoDB deployment")
    console.log("Choose Amazon Web Services, Sandbox, us east, give the database a name, and submit the order.")
    console.log("Create  new user. It will tell you how to add the username and password for your user into a mLab URI")
    const response = await inquirer
        .prompt({
            name: "mlab",
            message:
                "Enter your mLab URI",
        })
    const uri = response["mlab"]
    try {
        await mongoose.connect(uri, { useNewUrlParser: true })
        fs.appendFileSync('.env', `INFRA_MONGO_URI='${String(uri)}'`);
        console.log(`Added to environment file: INFRA_MONGO_URI='${String(uri)}'\n`);
    } catch (e) {
        console.log(uri)
        console.log(e)
        console.log('Invalid URI or failure on mongoose\'s end!')

    }
});
