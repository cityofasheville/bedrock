/* eslint-disable no-console, spaced-comment */
const fs = require('fs');
const Logger = require('coa-node-logging');
const CommandLineArgs = require('./CommandLineArgs');
const utilities = require('./utilities');
require('dotenv').config();
const ConnectionManager = require('./db/connection_manager');
const connectionDefinitions = require('./connection_definitions');

//////////////////////////////
// Local functions
//////////////////////////////

function run(path, config, logger) {
  const fd = fs.openSync(`${path}/mda.json`, 'r');
  const ddef = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
  console.log(`Running validation in ${path}`);
  console.log(`The mda.json file is:\n\n${JSON.stringify(ddef)}`);
  if (ddef.etl) {
    ddef.etl.forEach(job => {
      console.log(`Run the ${job.type} job using file ${job.file}`);
      if (job.active) {
        const fdSql = fs.openSync(`${path}/${job.file}`, 'r');
        const sql = fs.readFileSync(fdSql, { encoding: 'utf8' });
//const sql = 'select * from amd.bc_location limit 100';
        const cn = config.connectionManager.getConnection(job.db);
        console.log(sql);
        console.log('Now do the query');
        const result = cn.query(sql)
        .then(xx => { console.log('hi'); console.log(xx); });
      }
    });
  }
  // ddef.datasets.forEach((ds) => {
  //   const target = ds.target;
  //   if (target) {
  //     const cn = config.connectionManager.getConnection(target.connection);
  //     cn.tableInfo(cn.getDatabase(), target.schema, target.table)
  //       .then((columns) => {
  //         if (columns && ds.columns_specification.type !== 'none') {
  //           validate(columns, ds, target, path, logger);
  //         } else {
  //           logger.error('missing-table',
  //             `Target table ${target.table} does not exist or contains no columns`,
  //             {
  //               connection: cn.getConnectionName(),
  //               schema: target.schema,
  //               table: target.table,
  //             });
  //         }
  //       });
  //   }
  // });
}

const processDirectory = function processDirectory(path, recurse, handler) {
  const files = fs.readdirSync(path);
  const defIndex = files.indexOf('mda.json');
  console.log(`Directory ${path} with recurse = ${recurse}`);
  if (defIndex >= 0) {
    const lconfig = Object.assign({}, config, { files });
    const p = run(path, lconfig, logger);
    Promise.resolve(p);
  }
  if (recurse) {
    files.forEach(fileName => {
      const fullPath = `${path}/${fileName}`;
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory() && recurse) {
        processDirectory(fullPath, recurse, handler);
      }
    });
  }
};

const usageAndExit = function usageAndExit(message) {
  const usageString = `Usage: ${utilities.stripPath(process.argv[1])}`
                    + ' [validate | graphql | etl]'
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
const dir = (args.argCount() < 1) ? '.' : args.getArg(0);
const recurse = args.getOption('recurse', false);
const logger = new Logger('MDA', args.getOption('logfile', null));

const config = {
  indent: args.getOption('indent', 2),
  connectionManager: new ConnectionManager(connectionDefinitions, logger),
};

if (!fs.existsSync(dir)) usageAndExit(`Directory ${dir} not found.`);

processDirectory(dir, recurse, run);

