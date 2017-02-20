/* eslint-disable no-console */
const fs = require('fs');
const Logger = require('coa-node-logging');
const commandLine = require('coa-command-line-args');
const os = require('os');

require('dotenv').config();

const validator = require('./processors/validator');
const graphql = require('./processors/graphql');
const etl = require('./processors/etl');

const usage = function usage() {
  const usageString = `Usage: ${commandLine.stripPath(process.argv[1])} [validate | graphql | etl]`
                    + ' [--source=sourceDir] [--dest=destDir]'
                    + ' [--recurse]'
                    + ' [--logfile=logFilePath]'
                    + ' [--indent=numberOfSpaces]';
  console.log(usageString);
};

const args = commandLine.extractOptions(process.argv.slice(2));
if (args.args.length < 1) {
  usage();
  process.exit(1);
}
const doit = true;
if (doit) {
  console.log(`OS Platform is ${os.platform()}`);
  console.log(`OS Type is ${os.type()}`);
}
let logFile = null;
if ('logfile' in args.options) logFile = args.options.logfile;

const logger = new Logger('MDA', logFile);

let processor = null;
let triggerFile = 'mda.json';

const config = { indent: 2, db: 'datastore1' };

let startDirectory = '.';
if ('source' in args.options) startDirectory = args.options.source;
let destDirectory = '.';
if ('dest' in args.options) destDirectory = args.options.dest;
if ('indent' in args.options) config.indent = args.options.indent;

const command = args.args[0];

switch (command) {
  case 'validate':
    processor = validator;
    break;
  case 'graphql':
    processor = graphql;
    config.destDirectory = destDirectory;
    break;
  case 'etl':
    processor = etl;
    triggerFile = 'etl.json';
    break;
  default:
    console.error(`${command} processor not found.`);
    usage();
    process.exit(1);
    break;
}

// This routine walks the directory structure. When it identifies a dataset directory
// (by the existence of a 'dataset.json' file), it calls the processor function
// on it.

const processDirectory = function processDirectory(path, dest, processFunction) {
  const files = fs.readdirSync(path);
  const defIndex = files.indexOf(triggerFile);

  if (defIndex >= 0) {
    const lconfig = Object.assign({}, config, { files });
    const p = processFunction('run', path, dest, lconfig, logger);
    Promise.resolve(p);
  }

  files.forEach((fileName) => {
    const fullPath = `${path}/${fileName}`;
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath, dest, processFunction);
    }
  });
};

// Walk the directory hierarchy and run the processor on each dataset directory
if (processor) {
  if (!fs.existsSync(startDirectory)) {
    console.log(`Source directory ${startDirectory} not found.`);
    process.exit(1);
  }
  if (!fs.existsSync(destDirectory)) {
    console.log(`Destination directory ${destDirectory} not found`);
  }

  processor('init', null, destDirectory, config, logger);
  processDirectory(startDirectory, destDirectory, processor);
  processor('finish', null, destDirectory, config, logger);
}
