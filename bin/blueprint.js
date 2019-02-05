#!/usr/bin/env node
/* eslint-disable no-console */

const dotenv = require('dotenv');
const fs = require('fs');

// We must read the environment variables *before* we include any of the commands.
if (fs.existsSync('./.env')) {
  dotenv.config({ path: './.env' });
} else {
  dotenv.config({ path: 'c:/coa/bedrock/.env' });
}
const CommandLineArgs = require('../scripts/common/CommandLineArgs');
const blueprint = require('../scripts/blueprint');

const args = new CommandLineArgs(process.argv.slice(2));

blueprint(args);

function usageAndExit() {
  console.log('Usage:\tblueprint [snapshot|install]');
  process.exit(1);
}
