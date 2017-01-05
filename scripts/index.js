
const fs = require('fs');
const pg = require('pg');
const logging = require('coa-node-logging');

require('dotenv').config();

const logger = logging.createLogger('MDA', null);
const validator = require('./processors/validator');
const graphql = require('./processors/graphql');
const etl = require('./processors/etl');

// const dbCredentials = require('./db_credentials');
const dbCredentials = {
  host: process.env.dbhost,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  database: process.env.database,
  ssl: true,
};

const Pool = pg.Pool;

const pool = new Pool(dbCredentials);

const stripPath = function stripPath(path) {
  let filename = path;
  const index = path.lastIndexOf('/');
  if (index >= 0) filename = path.substring(index + 1);
  return filename;
};

const usage = function usage() {
  const usageString = `Usage: ${stripPath(process.argv[1])} [validate | graphql]`
                    + ' [--source=sourceDir] [--dest=destDir]'
                    + ' [--indent=numberOfSpaces]';
  console.log(usageString);
};

const options = {};
const extractOptions = function extractOptions(args) {
  const newArgs = [];
  args.forEach((arg) => {
    if (arg.startsWith('--')) {
      const eqIndex = arg.indexOf('=');
      if (eqIndex >= 0) {
        const optName = arg.substring(2, eqIndex);
        const optValue = arg.substring(eqIndex + 1);
        options[optName] = optValue;
      } else {
        const optName = arg.substring(2);
        options[optName] = true;
      }
    } else {
      newArgs.push(arg);
    }
  });
  return newArgs;
};

const args = extractOptions(process.argv.slice(2));
if (args.length < 1) {
  usage();
  process.exit(1);
}

let processor = null;
let triggerFile = 'dataset.json';

const config = { indent: 2, pool, db: dbCredentials.database };

let startDirectory = '.';
if ('source' in options) startDirectory = options.source;
let destDirectory = '.';
if ('dest' in options) destDirectory = options.dest;
if ('indent' in options) config.indent = options.indent;

const command = args[0];
console.log(`Running the ${command} processor.`);
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
    console.error('ETL processing not yet implemented');
    // Need to do an init version where we build a tree and do the topological
    // sort. Then another where we actually run.
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

/*
 * Need to rethink. The processor routine should take the current path, a configuration object,
 * and a logger. The processor is called on each subdirectory and then one final time at the end.
 * This will do the right thing to figure out the ETL tree, but what about running it. Maybe
 * We have an etl --init and then etl --run calls.
 *
 * Note that the graphql run at the moment is wrong. It won't work if there is more than one
 * dataset. - need that extra call at the end to do the dump.
 */
const processDirectory = function processDirectory(path, dest, processFunction) {
  const files = fs.readdirSync(path);
  const defIndex = files.indexOf(triggerFile);

  if (defIndex >= 0) {
    console.log(`Processing dataset directory ${path}`);
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
  return;
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

  pool.end((err, value) => {
    if (err) {
      console.log('There was an error releasing the pool');
    }
    return value;
  });
}
