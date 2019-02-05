/* eslint-disable no-console, spaced-comment, global-require */
const fs = require('fs');
const Logger = require('coa-node-logging');
const path = require('path');
const CommandLineArgs = require('../common/CommandLineArgs');
const usageAndExit = require('./usage');
const tasks = {
  validate: require('./tasks/validator'),
  graphql: require('./tasks/graphql'),
  init_etl: require('./tasks/init_etl'),
  list: require('./tasks/list'),
  checkin: require('./tasks/checkin'),
};

module.exports = function processAndValidateArgs(argv) {
  const args = new CommandLineArgs(argv);
  if (args.argCount() < 1) usageAndExit();

  const command = args.getArg(0);
  const oneAsset = args.getArg(1);
  const task = tasks[command];
  if (!task) usageAndExit(`traverse_and_run_task: ${command} task not found.`);

  const startDir = args.getOption('start', '.');
  const destDir = args.getOption('dest', path.join(__dirname, '/../../etl_jobs_dir'));
  const schema = args.hasOption('schema');
  const metadata = args.hasOption('metadata');
  const allAssets = args.hasOption('all');

  if (!fs.existsSync(startDir)) {
    usageAndExit(`traverse_and_run_task: Start directory ${startDir} not found.`);
  }
  if (!fs.existsSync(destDir)) {
    usageAndExit(`traverse_and_run_task: Destination directory ${destDir} not found`);
  }

  return {
    task,
    //startDir,
    destDir,
    logger: new Logger('traverse_and_run_task', args.getOption('logfile', null)),
    config: {
      recurse: !args.hasOption('norecurse'),
      indent: args.getOption('indent', 2),
      schema,
      metadata,
      oneAsset,
      allAssets,
      startDir,
    },
  };
};
