/* eslint-disable no-console, spaced-comment, global-require */
const usageAndExit = require('./usage');
const CommandLineArgs = require('../common/CommandLineArgs');
const Logger = require('coa-node-logging');

module.exports = function processAndValidateArgs(argv) {
  console.log('start processing');
  const args = new CommandLineArgs(argv);
  if (args.argCount() < 1) usageAndExit();

  const config = {
    init: true,
    loadPoints: ('parallelLoad' in args.options) ? args.options.parallelLoad : 2,
    jobFileName: ('jobFile' in args.options) ? args.options.jobFile : 'etl_jobs_definition.json',
    jobFileDate: 'etl_jobs_date.json',
    workingDirectory: args.args[0],
    logger: new Logger('traverse_and_run_task', args.getOption('logfile', null)),
  };
  console.log('done with processing');
  return config;
};

