/* eslint-disable no-console, spaced-comment, global-require */
require('dotenv').config();
const processAndValidateArgs = require('./traverse_and_do_task/processAndValidateArgs');
const processDirectory = require('./traverse_and_do_task/processDirectory');

const args = processAndValidateArgs(process.argv.slice(2));
const task = args.task;

///////////////////////////////////////////////////////
// Each task potentially has an initialization phase,
// a main phase, and a finalization phase.
///////////////////////////////////////////////////////

task('init', null, args.destDir, args.config, args.logger);
processDirectory(args.startDir, args.destDir, task, args.config, args.logger);
task('finish', null, args.destDir, args.config, args.logger);

