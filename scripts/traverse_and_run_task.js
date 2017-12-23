/* eslint-disable no-console, spaced-comment, global-require */
require('dotenv').config();
const processDirectory = require('./traverse_and_run_task/processDirectory');
const processAndValidateArgs = require('./traverse_and_run_task/processAndValidateArgs');
const args = processAndValidateArgs(process.argv.slice(2));
const task = args.task;

///////////////////////////////////////////////////////
// Each task potentially has an initialization phase,
// a main phase, and a finalization phase.
///////////////////////////////////////////////////////

task('init', null, args.destDir, args.config, args.logger);
processDirectory(args.startDir, args.destDir, task, args.config, args.logger);
task('finish', null, args.destDir, args.config, args.logger);

