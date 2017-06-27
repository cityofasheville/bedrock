/* eslint-disable no-console, spaced-comment */
const fs = require('fs');
const Logger = require('coa-node-logging');
const CommandLineArgs = require('./CommandLineArgs');
const utilities = require('./utilities');
require('dotenv').config();
const ConnectionManager = require('./db/connection_manager');
const connectionDefinitions = require('./connection_definitions');
const validate = require('./processors/validator');
const graphql = require('./processors/graphql');
const etl = require('./processors/etl');
const processors = { validate, graphql, etl };

//////////////////////////////
// Local functions
//////////////////////////////

const processDirectory = function processDirectory(path, dest, recurse, handler) {
  const files = fs.readdirSync(path);
  const defIndex = files.indexOf('mda.json');
  console.log(`Directory ${path} with recurse = ${recurse}`);
  if (defIndex >= 0) {
    const lconfig = Object.assign({}, config, { files });
    const p = handler('run', path, dest, lconfig, logger);
    Promise.resolve(p);
  }
  if (recurse) {
    files.forEach((fileName) => {
      const fullPath = `${path}/${fileName}`;
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory() && recurse) {
        processDirectory(fullPath, dest, recurse, handler);
      }
    });
  }
};

const usageAndExit = function usageAndExit(message) {
  const usageString = `Usage: ${utilities.stripPath(process.argv[1])}`
                    + ' [validate | graphql | etl]'
                    + ' [--start=startDir] [--dest=destDir]'
                    + ' [--recurse]'
                    + ' [--logfile=logFilePath]'
                    + ' [--indent=numberOfSpaces]';
  console.log(message);
  console.log(usageString);
  process.exit(1);
};

//////////////////////////////
// Main work
//////////////////////////////

const args = new CommandLineArgs(process.argv.slice(2));
if (args.argCount() < 1) usageAndExit('Missing command.');
const command = args.getArg(0);
const processor = processors[command];
if (!processor) usageAndExit(`${command} processor not found.`);

const logger = new Logger('MDA', args.getOption('logfile', null));
const startDir = args.getOption('start', '.');
const destDir = args.getOption('dest', '.');
const config = {
  indent: args.getOption('indent', 2),
  destDir,
  connectionManager: new ConnectionManager(connectionDefinitions, logger),
};

if (!fs.existsSync(startDir)) usageAndExit(`Start directory ${startDir} not found.`);
if (!fs.existsSync(config.destDir)) usageAndExit(`Destination directory ${destDir} not found`);

// Walk the directory hierarchy and run the processor on each dataset directory
processor('init', null, config.destDir, config, logger);
processDirectory(startDir, config.destDir, args.hasOption('recurse'), processor);
processor('finish', null, config.destDir, config, logger);

