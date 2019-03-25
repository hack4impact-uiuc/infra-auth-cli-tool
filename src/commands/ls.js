// @flow
const handleErrors = require("../utils/handleErrors");
const fs = require("fs");
const copy = require("recursive-copy");

module.exports.command = "init [name]";
module.exports.describe =
  "Lists all the VMs that currently store sdfsfilename.";
module.exports.builder = (yargs: any) => yargs;

module.exports.handler = handleErrors(async (argv: {}) => {
  fs.mkdirSync(`${process.cwd()}/${argv.name}`);
const templatePath = `${__dirname.slice(0,-12)}/templates/infra-authentication-server`;
  copy(templatePath, argv.name)
    .then(function(results) {
      console.info("Copied " + results.length + " files");
    })
    .catch(function(error) {
      console.error("Copy failed: " + error);
    });
});
