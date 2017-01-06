const fs = require('fs');
const logging = require('coa-node-logging');
require('dotenv').config();
const logger = logging.createLogger('MDA', null);
const commandLine = require('coa-command-line-args');

const usage = function usage() {
  const usageString = `Usage: ${commandLine.stripPath(process.argv[1])} working_directory`
                    + ' [--parallelLoad=load_points]'
                    + ' [--jobFile=job_file_name]';
  console.log(usageString);
};

const args = commandLine.extractOptions(process.argv.slice(2));
if (args.args.length < 1) {
  usage();
  process.exit(1);
}

const loadPoints = ('parallelLoad' in args.options) ? args.options.parallelLoad : 10;
const jobFileName = ('jobFile' in args.options) ? args.options.parallelLoad : ''
