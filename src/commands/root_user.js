const handleErrors = require("../utils/handleErrors");

module.exports.command = "root_user";
module.exports.describe =
    "Creates a root user in the database";
module.exports.builder = (yargs) => yargs;

const generatePassword = () => {
    var length = 12,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

 module.exports.handler = handleErrors(async (argv) => {
    try {
        console.log("Creating root user...");
        const path = process.cwd() + "/src/models/User";
        const User = require(path);
        const INFRA_EMAIL = process.env.INFRA_EMAIL;
        const randomPass = generatePassword();
        const userData = {
            email: INFRA_EMAIL,
            password: randomPass,
            role: "root",
            verified: true
          };
        const user = new User(userData);
        console.log(userData)
        try {
            await user.save();
            console.log(
                "User successfully created!",
                `email: ${INFRA_EMAIL}`,
                `password: ${randomPassword}`
            );
        } catch (e) {
            return console.error(e, "there was an error creating the user");
        };
    } catch (e) {
        return console.error(e, 'Something went wrong');
    }
})