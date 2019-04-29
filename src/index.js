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

const asset = require('./asset');
const bedrock = require('./bedrock');

const CommandLineArgs = require('./common/CommandLineArgs');
const args = new CommandLineArgs(process.argv.slice(2));
if (args.argCount() < 2) usageAndExit();

const target = args.popArg();
const command = args.popArg();

switch (target) {
  case 'asset': // Manage data assets
    asset(command, args);
    break;
  case 'blueprint': // Manage blueprints
    console.log('Blueprint target');
    break;
  case 'etl': // Manage ETL jobs
    console.log('ETL target');
    break;
  case 'lib': // Manage library version of Bedrock
    console.log('Lib target');
    break;
  case 'bedrock': // Initialize a new Bedrock database
    console.log('Bedrock target');
    bedrock(command, args);
    break;
  default:
    usageAndExit();
}

function usageAndExit() {
  console.log('Usage:\tbedrock [asset|blueprint|etl|lib|bedrock] command [args]');
  process.exit(1);
}
