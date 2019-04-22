// @flow
const handleErrors = require("../utils/handleErrors");
const fs = require("fs");
const copy = require("recursive-copy");
const git = require('simple-git')
const INFRA_PATH = 'https://github.com/hack4impact-uiuc/infra-authentication-server'


module.exports.command = "create-repo-setup [name]";
module.exports.describe =
  "Lists all the VMs that currently store sdfsfilename.";
module.exports.builder = (yargs: any) => yargs;

module.exports.handler = handleErrors(async (argv: {}) => {
  const localPath = `${process.cwd()}/${argv.name}`
  fs.mkdirSync(`${process.cwd()}/${argv.name}`);
  await git().clone(INFRA_PATH, localPath)
  console.log("Sucessfully created the repository")
});
