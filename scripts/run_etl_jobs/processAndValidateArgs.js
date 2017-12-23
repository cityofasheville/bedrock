/* eslint-disable no-console, spaced-comment, global-require */
const usageAndExit = require('./usage');
const CommandLineArgs = require('../common/CommandLineArgs');
const fs = require('fs');
const Logger = require('coa-node-logging');
const tasks = {
  validate: require('./tasks/validator'),
  graphql: require('./tasks/graphql'),
  etl: require('./tasks/etl'),
  list: require('./tasks/list'),
};

module.exports = function processAndValidateArgs(argv) {
  const args = new CommandLineArgs(argv);
  if (args.argCount() < 1) usageAndExit();

  const config = {
    init: true,
    loadPoints: ('parallelLoad' in args.options) ? args.options.parallelLoad : 2,
    jobFileName: ('jobFile' in args.options) ? args.options.jobFile : 'etl_jobs_definition.json',
    jobFileDate: 'etl_jobs_date.json',
    workingDirectory = args.args[0],
    logger: new Logger('traverse_and_run_task', args.getOption('logfile', null)),
  };

  return config;
};

