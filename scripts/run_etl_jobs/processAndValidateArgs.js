/* eslint-disable no-console, spaced-comment, global-require */
const Logger = require('coa-node-logging');
const path = require('path');
const usageAndExit = require('./usage');
const CommandLineArgs = require('../common/CommandLineArgs');

module.exports = function processAndValidateArgs(argv) {
  console.log('start processing');
  const args = new CommandLineArgs(argv);
  if (args.argCount() < 1) usageAndExit();

  const config = {
    init: true,
    loadPoints: ('parallelLoad' in args.options) ? args.options.parallelLoad : 2,
    jobFileName: ('jobFile' in args.options) ? args.options.jobFile : 'etl_jobs_definition.json',
    jobFileDate: 'etl_jobs_date.json',
    workingDirectory: ('dest' in args.options) ? args.options.dest : path.join(__dirname, '/../../etl_jobs_dir'),
    logger: new Logger('traverse_and_run_task', args.getOption('logfile', './etl_jobs_dir/etl.log')),
  };
  console.log('done with processing');
  return config;
};
