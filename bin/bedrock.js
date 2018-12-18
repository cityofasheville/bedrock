#!/usr/bin/env node

require('dotenv').config({ path: 'c:/jon/bedrock/.env' })
const { stripPath } = require('../scripts/common/utilities');

let bedrock = require('../index.js');
const CommandLineArgs = require('../scripts/common/CommandLineArgs');
const checkout = require('../scripts/checkout');
const report = require('../scripts/report_status');
const traverse_and_do_task = require('../scripts/traverse_and_do_task');
const run_etl_jobs = require('../scripts/run_etl_jobs');
const args = new CommandLineArgs(process.argv.slice(2));
if (args.argCount() < 1) usageAndExit();

const command = args.getArg(0);

// console.log('start',args.getOption('start', 'none'));
// console.log("command: ", command);
// console.log("env:db1host: ", process.env.db1host)
// console.log("Current dir: ", process.cwd(), __dirname);

if(command==="version"){
    console.log(bedrock.version());
}else if(command==="checkout"){
    checkout().catch(e => {console.error('query error', e.message, e.stack);});
}else if(command==="checkin" || command==="init_etl" || command==="list"){
    traverse_and_do_task();
}else if(command==="run_etl"){
    run_etl_jobs();
}else if(command==="report"){
    report();
}

function usageAndExit(){
    console.log(`Usage:\tbedrock [checkin|checkout|init_etl|run_etl|report|list|version]`);
    process.exit(1);
}
    // "init_etl": "node ./scripts/traverse_and_do_task.js etl --start=./working_directory --dest=./etl_jobs_dir --logfile=./etl_jobs_dir/joblog.log",
    // "run_etl": "node ./scripts/run_etl_jobs.js --logfile=./etl_jobs_dir/etl.log --dest=./etl_jobs_dir",
    // "checkout": "node ./scripts/checkout.js --start=./working_directory",
    // "checkin": "node ./scripts/traverse_and_do_task.js checkin --start=./working_directory",
    // "report": "node ./scripts/report_status.js"
