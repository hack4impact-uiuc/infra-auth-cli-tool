const handleErrors = require("../utils/handleErrors");
const jsYaml = require('js-yaml')
const fs = require('fs')
const inquirer = require("inquirer")
module.exports.command = "roles_setup";
module.exports.describe =
    "Customize roles positions";
module.exports.builder = (yargs) => yargs;

const roles = { "root": null }


setRoles = async () => {
    let permission_level_choices = ["Add a permission level", "Delete a permission level", "Submit permission levels"]
    let creatingRoles = true
    while (creatingRoles) {
        const response = await inquirer
            .prompt({
                type: "list",
                name: "permission_level",
                message:
                    "The current permission levels are \n  " + Object.keys(roles).join("     \n  ") + "\n What would you like to do.",
                choices: permission_level_choices
            })
        if (response["permission_level"] === permission_level_choices[0]) {
            const second_response = await inquirer.prompt({
                name: 'add',
                message: "What is the name of your new role",

            });
            roles[second_response['add']] = null

        }
        if (response["permission_level"] === permission_level_choices[1]) {

            const second_response = await inquirer.prompt({
                type: 'list',
                name: 'delete',
                message: "What role would you like to delete",
                choices: Object.keys(roles)
            });
            delete roles[second_response['delete']]
        }
        if (response["permission_level"] === permission_level_choices[2]) {
            creatingRoles = false
        }
    }
}

setEachRolesPermissions = async () => {
    for (role in Object.keys(roles)) {
        let roleName = Object.keys(roles)[role]
        const response = await inquirer
            .prompt({
                type: "checkbox",
                name: "permission_level",
                message:
                    "The role " + roleName.toUpperCase() + " should be able to promote or demote people within these user permissions. \n For instance, if I'm a root user, I want the ability to promote a guest user to root and visa versa, so I would select both guest and root. \n The lowest permission level should not have anything selected since you don't need permission to sign up for this level. For instance, for the guest role I wouldn't select anything since anyone can sign up as a guest. \n Select ALL roles that the user would be able to promote/demote.",
                choices: Object.keys(roles)
            })
        console.log(response["permission_level"])
        if ((response["permission_level"].length) != 0) {
            roles[roleName] = response["permission_level"]
            console.log("The role " + roleName.toUpperCase() + " can now promote or demote users with the permission levels " + roles[roleName].join(", "))
        } else {
            console.log("The role " + roleName.toUpperCase() + " can NOT promote or demote any users")
        }
    }
}
module.exports.handler = handleErrors(async (argv) => {
    try {
        await setRoles();
        await setEachRolesPermissions();
    } catch (e) {
        return console.error(e);
    }
    const configInfo = await jsYaml.safeLoad(fs.readFileSync('config.yml', 'utf8'))
    configInfo["roles"] = roles
    const yamlStr = jsYaml.safeDump({ ...configInfo })
    await fs.writeFile('config.yml', yamlStr, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('Success!')
        }
    })
})