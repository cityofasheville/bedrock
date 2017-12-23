/* eslint-disable no-console, spaced-comment, global-require */
require('dotenv').config();
const fs = require('fs');
const Logger = require('coa-node-logging');
const CommandLineArgs = require('./common/CommandLineArgs');
const { stripPath } = require('./common/utilities');
const processors = {
  validate: require('./h_apply/processors/validator'),
  graphql: require('./h_apply/processors/graphql'),
  etl: require('./h_apply/processors/etl'),
  list: require('./h_apply/processors/list'),
};
const processDirectory = require('./h_apply/processDirectory');

const usageAndExit = function usageAndExit(message = null) {
  const usageString = '\nApply a processor to a hierarchy of data assets.\n\n'
                    + `Usage:\t${stripPath(process.argv[1])}`
                    + ' [list | etl | graphql | validate]'
                    + '\n\t\t[--start=startDir] [--dest=destDir]'
                    + '\n\t\t[--norecurse]'
                    + '\n\t\t[--logfile=logFilePath]'
                    + '\n\t\t[--indent=numberOfSpaces]';
  if (message) console.log(message);
  console.log(usageString);
  process.exit(1);
};

////////////////////////////////////
// Validate arguments & initialize
////////////////////////////////////

const args = new CommandLineArgs(process.argv.slice(2));
if (args.argCount() < 1) usageAndExit();
const command = args.getArg(0);
const processor = processors[command];
if (!processor) usageAndExit(`mda_h_apply: ${command} processor not found.`);

const logger = new Logger('mda_h_apply', args.getOption('logfile', null));
const startDir = args.getOption('start', '.');
const destDir = args.getOption('dest', '.');
const config = { indent: args.getOption('indent', 2) };
const recurse = !args.hasOption('norecurse');

if (!fs.existsSync(startDir)) usageAndExit(`mda_h_apply: Start directory ${startDir} not found.`);
if (!fs.existsSync(destDir)) usageAndExit(`mda_h_apply: Destination directory ${destDir} not found`);

//////////////////////////////////////////////
// This is a 3-phase process:
//   - Initialize
//   - Walk the hierarchy and run processor on
//     each dataset directory
//   - Finalize
//////////////////////////////////////////////

processor('init', null, destDir, config, logger);
processDirectory(startDir, destDir, recurse, processor, config, logger);
processor('finish', null, destDir, config, logger);

