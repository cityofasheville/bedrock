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

  const command = args.getArg(0);
  const task = tasks[command];
  if (!task) usageAndExit(`traverse_and_run_task: ${command} task not found.`);

  const startDir = args.getOption('start', '.');
  const destDir = args.getOption('dest', '.');
  if (!fs.existsSync(startDir)) {
    usageAndExit(`traverse_and_run_task: Start directory ${startDir} not found.`);
  }
  if (!fs.existsSync(destDir)) {
    usageAndExit(`traverse_and_run_task: Destination directory ${destDir} not found`);
  }

  return {
    task,
    startDir,
    destDir,
    logger: new Logger('traverse_and_run_task', args.getOption('logfile', null)),
    config: {
      recurse: !args.hasOption('norecurse'),
      indent: args.getOption('indent', 2),
    },
  };
};

