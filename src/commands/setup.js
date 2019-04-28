const handleErrors = require("../utils/handleErrors");
const jsYaml = require('js-yaml')
const fs = require('fs')
const inquirer = require("inquirer")
const { handler: create_repository } = require("./create_repository")
const { handler: forgot_password_email_setup } = require("./forgot_password_email_setup")
const { handler: email_setup } = require("./email_setup")
const { handler: mlab_setup } = require("./mlab_setup")
const { handler: roles_setup } = require("./roles_setup")
module.exports.command = "setup";
module.exports.describe =
    "Sets up the entire authentication server";
module.exports.builder = (yargs) => yargs;

const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports.handler = handleErrors(async (argv) => {

    await create_repository(argv)

    console.log("\n")
    console.log("Let's set up the different roles")
    console.log("\n")
    await roles_setup(argv)

    await delay(1000);

    console.log("\n")
    console.log("Let's set up the mlab url roles")
    console.log("\n")
    await mlab_setup(argv)

    await delay(1000);

    console.log("\n")
    console.log("Let's set up the forgot password and email options")
    console.log("\n")
    await forgot_password_email_setup(argv)

    await delay(1000);

    console.log("\n")
    console.log("Let's authenticate your email")
    console.log("\n")
    await email_setup(argv)

    await delay(1000);

    console.log("\n")
    console.log("Congrats, you have made your authentication server")
    console.log("Please head over to the deployment documentation in the README")
    console.log("\n")

})