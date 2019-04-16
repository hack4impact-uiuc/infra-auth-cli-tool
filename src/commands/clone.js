const handleErrors = require("../utils/handleErrors");
const git = require('simple-git')
const LOCAL_PATH = 'templates/'
const INFRA_PATH = 'https://github.com/hack4impact-uiuc/infra-authentication-server'

module.exports.command = "clone";
module.exports.describe =
    "Clones authentication server into template directory";
module.exports.builder = (yargs) => yargs;

module.exports.handler = handleErrors(async (argv) => {
    git().clone(INFRA_PATH, LOCAL_PATH)
})