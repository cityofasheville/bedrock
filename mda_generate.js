/* eslint-disable no-console, spaced-comment */
require('dotenv').config();
const fs = require('fs');
const Logger = require('coa-node-logging');
const CommandLineArgs = require('./src/CommandLineArgs');
const utilities = require('./src/utilities');
const validate = require('./src/processors/validator');
const graphql = require('./src/processors/graphql');
const etl = require('./src/processors/etl');
const processors = { validate, graphql, etl };

const usageAndExit = function usageAndExit(message) {
  const usageString = `Usage:\t${utilities.stripPath(process.argv[1])}`
                    + ' [etl | graphql | validate]'
                    + '\n\t\t[--start=startDir] [--dest=destDir]'
                    + '\n\t\t[--recurse]'
                    + '\n\t\t[--logfile=logFilePath]'
                    + '\n\t\t[--indent=numberOfSpaces]';
  console.log(message);
  console.log(usageString);
  process.exit(1);
};

////////////////////////////////////
// Validate arguments & initialize
////////////////////////////////////

const args = new CommandLineArgs(process.argv.slice(2));
if (args.argCount() < 1) usageAndExit('Missing command.');
const command = args.getArg(0);
const processor = processors[command];
if (!processor) usageAndExit(`${command} processor not found.`);

const logger = new Logger('MDA', args.getOption('logfile', null));
const startDir = args.getOption('start', '.');
const destDir = args.getOption('dest', '.');
const config = { indent: args.getOption('indent', 2) };

if (!fs.existsSync(startDir)) usageAndExit(`Start directory ${startDir} not found.`);
if (!fs.existsSync(destDir)) usageAndExit(`Destination directory ${destDir} not found`);

//////////////////////////////
// Do the processing
//////////////////////////////
const processDirectory = function processDirectory(path, dest, recurse, handler) {
  const files = fs.readdirSync(path);
  const defIndex = files.indexOf('mda.json');
  // console.log(`Directory ${path} with recurse = ${recurse}`);
  if (defIndex >= 0) {
    const fd = fs.openSync(`${path}/mda.json`, 'r');
    const mda = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
    const lconfig = Object.assign({ mda }, config, { files });
    const p = handler('run', path, dest, lconfig, logger);
    Promise.resolve(p);
  }
  if (recurse) {
    files.forEach(fileName => {
      const fullPath = `${path}/${fileName}`;
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory() && recurse) {
        processDirectory(fullPath, dest, recurse, handler);
      }
    });
  }
};
// Walk the directory hierarchy and run the processor on each dataset directory
processor('init', null, destDir, config, logger);
processDirectory(startDir, destDir, args.hasOption('recurse'), processor);
processor('finish', null, destDir, config, logger);

