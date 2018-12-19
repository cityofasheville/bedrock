#!/usr/bin/env node

require('dotenv').config({ path: 'c:/coa/bedrock/.env' })
const { stripPath } = require('../scripts/common/utilities');

let bedrock = require('../index.js');
const CommandLineArgs = require('../scripts/common/CommandLineArgs');
const checkout = require('../scripts/checkout');
const report = require('../scripts/report_status');
const traverse_and_do_task = require('../scripts/traverse_and_do_task');
const create_asset = require('../scripts/create_asset');
const create_schema = require('../scripts/create_schema');
const run_etl_jobs = require('../scripts/run_etl_jobs');
const args = new CommandLineArgs(process.argv.slice(2));
if (args.argCount() < 1) usageAndExit();

const command = args.getArg(0);

if(command==="version"){
    console.log(bedrock.version());
}else if(command==="checkout"){
    checkout().catch(e => {console.error('query error', e.message, e.stack);});
}else if(command==="checkin" || command==="init_etl" || command==="list"){
    traverse_and_do_task();
}else if(command==="create-asset"){
    create_asset();
}else if(command==="create-schema"){
    create_schema();
}else if(command==="run_etl"){
    run_etl_jobs();
}else if(command==="report"){
    report();
}

function usageAndExit(){
    console.log(`Usage:\tbedrock [checkin|checkout|init_etl|run_etl|report|create|version]`);
    process.exit(1);
}
