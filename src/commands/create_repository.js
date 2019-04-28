// @flow
const handleErrors = require("../utils/handleErrors");
const fs = require("fs");
const copy = require("recursive-copy");
const git = require('simple-git')
const INFRA_PATH = 'https://github.com/hack4impact-uiuc/infra-authentication-server'
const inquirer = require("inquirer");


module.exports.command = "create_repository";
module.exports.describe =
  "Lists all the VMs that currently store sdfsfilename.";
module.exports.builder = (yargs: any) => yargs;

module.exports.handler = handleErrors(async (argv: {}) => {
  const response = await inquirer
  .prompt({
      name: "name",
      message:
          "What do you want the name of the folder to be?",
  })
  const name = response["name"]
  const localPath = `${process.cwd()}/${name}`
  try {
    fs.mkdirSync(`${process.cwd()}/${name}`);
  } catch (e) {
    console.log("Could not create repository. (There may already be another directory with the same name)")
    process.exit()
  }
  await git().silent(true).clone(INFRA_PATH, localPath)
  await process.chdir(localPath);
  await execPromise("npm", ["install"], {
    stdio: "inherit"
  });
  console.log("Sucessfully created the repository\n")
});
