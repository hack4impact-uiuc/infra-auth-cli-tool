const handleErrors = require("../utils/handleErrors");
const jsYaml = require('js-yaml')
const fs = require('fs')
const inquirer = require("inquirer")

module.exports.command = "get-auth";
module.exports.describe =
    "Clones authentication server into templates directory";
module.exports.builder = (yargs) => yargs;

module.exports.handler = handleErrors(async (argv) => {
    
})