const handleErrors = require("../utils/handleErrors");
const { handler: dropUsers}  = require("./dropusers")
const { handler: initRoot} = require("./root")
module.exports.command = "init-users [email]";
module.exports.describe =
    "Inits Users Database with email provided as root user";
module.exports.builder = yargs => yargs;

module.exports.handler = handleErrors(async argv => {
    await dropUsers(argv)
    await initRoot(argv)
});