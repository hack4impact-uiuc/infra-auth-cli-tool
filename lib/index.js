#!/usr/bin/env node
//     
const yargs = require('yargs');

const argv = yargs
  .commandDir('./commands')
  .help('help')
  .alias('h', 'help')
  .argv;