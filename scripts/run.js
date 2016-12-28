
const fs = require('fs');
const pg = require('pg');

const validator = require('./processors/validator');
const graphql = require('./processors/graphql');

const dbCredentials = require('./db_credentials');
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
const config = { indent: 2 };

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
    config.pool = pool;
    config.db = dbCredentials.database;
    break;
  case 'graphql':
    processor = graphql;
    config.destDirectory = destDirectory;
    config.pool = pool;
    config.db = dbCredentials.database;
    break;
  default:
    console.error(`${command} processor not found.`);
    usage();
    process.exit(1);
    break;
}

const registerError = function registerError(error) {
  console.log(`We have an error: ${error}`);
};

const processDirectory = function processDirectory(path, dest, processFunction) {
  const files = fs.readdirSync(path);
  const defIndex = files.indexOf('dataset.json');

  if (defIndex >= 0) {
    console.log(`Processing a dataset in ${path}`);
    const lconfig = Object.assign({}, config, { files });
    const p = processFunction(path, dest, lconfig, registerError);
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

if (processor) {
  if (!fs.existsSync(startDirectory)) {
    console.log(`Source directory ${startDirectory} not found.`);
    process.exit(1);
  }
  if (!fs.existsSync(destDirectory)) {
    console.log(`Destination directory ${destDirectory} not found`);
  }
  processDirectory(startDirectory, destDirectory, processor);
  pool.end((err, value) => {
    if (err) {
      console.log('There was an error releasing the pool');
    }
    return value;
  });
}
