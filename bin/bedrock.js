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
const version = require('../scripts/common/version.js');
const CommandLineArgs = require('../scripts/common/CommandLineArgs');
const checkout = require('../scripts/checkout');
const report = require('../scripts/report_status');
const traverseAndDoTask = require('../scripts/traverse_and_do_task');
const createAsset = require('../scripts/create_asset');
const runEtlJobs = require('../scripts/run_etl_jobs');
const initDb = require('../scripts/init_db');
const blueprint = require('../scripts/blueprint');
const args = new CommandLineArgs(process.argv.slice(2));
if (args.argCount() < 1) usageAndExit();

const command = args.popArg();

// console.log('start',args.getOption('start', 'none'));
// console.log('command: ', command);
// console.log('env:db1host: ', process.env.db1host)
// console.log('Current dir: ', process.cwd(), __dirname);


if (command === 'version') {
  console.log(version());
} else if (command === 'checkout') {
  checkout().catch(e => { console.error('query error', e.message, e.stack); });
} else if (command === 'checkin' || command === 'init_etl' || command === 'list') {
  traverseAndDoTask();
} else if (command === 'create-asset') {
  createAsset();
} else if (command === 'run_etl') {
  runEtlJobs();
} else if (command === 'report') {
  report();
} else if (command === 'initdb') {
  initDb(args);
} else if (command === 'blueprint') {
  blueprint(args);
} else {
  console.error(`Unknown command ${command}`);
}

function usageAndExit() {
  console.log('Usage:\tbedrock [checkin|checkout|init_etl|run_etl|report|initdb|create-asset|version]');
  process.exit(1);
}
