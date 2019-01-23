#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const dotenv = require('dotenv');
const bedrock = require('../index.js');
const CommandLineArgs = require('../scripts/common/CommandLineArgs');
const checkout = require('../scripts/checkout');
const report = require('../scripts/report_status');
const traverseAndDoTask = require('../scripts/traverse_and_do_task');
const createAsset = require('../scripts/create_asset');
const createSchema = require('../scripts/create_schema');
const runEtlJobs = require('../scripts/run_etl_jobs');
const args = new CommandLineArgs(process.argv.slice(2));
if (args.argCount() < 1) usageAndExit();

if (fs.existsSync('./.env')) {
  dotenv.config({ path: './.env' });
} else {
  dotenv.config({ path: 'c:/coa/bedrock/.env' });
}
const command = args.getArg(0);

// console.log('start',args.getOption('start', 'none'));
// console.log('command: ', command);
// console.log('env:db1host: ', process.env.db1host)
// console.log('Current dir: ', process.cwd(), __dirname);


if (command === 'version') {
  console.log(bedrock.version());
} else if (command === 'checkout') {
  checkout().catch(e => { console.error('query error', e.message, e.stack); });
} else if (command === 'checkin' || command === 'init_etl' || command === 'list') {
  traverseAndDoTask();
} else if (command === 'create-asset') {
  createAsset();
} else if (command === 'create-schema') {
  createSchema();
} else if (command === 'run_etl') {
  runEtlJobs();
} else if (command === 'report') {
  report();
}

function usageAndExit() {
  console.log('Usage:\tbedrock [checkin|checkout|init_etl|run_etl|report|create-asset|version]');
  process.exit(1);
}