#!/usr/bin/env node
/* eslint-disable no-console */

const dotenv = require('dotenv');
const fs = require('fs');
const asset = require('./asset');

// We must read the environment variables *before* we include any of the commands.
if (fs.existsSync('./.env')) {
  dotenv.config({ path: './.env' });
} else {
  dotenv.config({ path: 'c:/coa/bedrock/.env' });
}

const CommandLineArgs = require('../scripts/common/CommandLineArgs');
const args = new CommandLineArgs(process.argv.slice(2));
if (args.argCount() < 2) usageAndExit();

const target = args.popArg();
const command = args.popArg();

switch (target) {
  case 'asset':
    asset(command, args);
    break;
  case 'blueprint':
    console.log('Blueprint target');
    break;
  case 'etl':
    console.log('ETL target');
    break;
  case 'lib':
    console.log('Lib target');
    break;
  case 'bedrock':
    console.log('Bedrock target');
    break;
  default:
    usageAndExit();
}

function usageAndExit() {
  console.log('Usage:\tbedrock [checkin|checkout|init_etl|run_etl|report|initdb|create-asset|version]');
  process.exit(1);
}
