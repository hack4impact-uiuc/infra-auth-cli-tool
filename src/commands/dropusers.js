const User = require("../../templates/infra-authentication-server/src/models/User");
const mongoose = require("mongoose");
const handleErrors = require("../utils/handleErrors");
const {
    getProdURI, getTestURI
} = require("../../templates/infra-authentication-server/src/utils/getConfigFile");
module.exports.command = "drop-users";
module.exports.describe =
    "clears User database";
module.exports.builder = yargs => yargs;

module.exports.handler = handleErrors(async argv => {
    try {

        const uri = await getProdURI();
        // const uri = await getTestURI();

        await mongoose.connect(uri, { useNewUrlParser: true });
        User.remove({}, () => {
            console.info('successfully dropped User database')
        })
        return
    } catch (e) {
        console.error('an error occurred:', e)
    }
})