/* eslint-disable no-console, spaced-comment, global-require */
const processAndValidateArgs = require('./traverse_and_do_task/processAndValidateArgs');
const processDirectory = require('./traverse_and_do_task/processDirectory');

///////////////////////////////////////////////////////
// Each task potentially has an initialization phase,
// a main phase for each folder, and a finalization phase.
// (param: stage, path, dest, config, logger)
///////////////////////////////////////////////////////

async function traverse_and_do_task(){
    const args = processAndValidateArgs(process.argv.slice(2));
    const task = args.task;
    await task('init', null, args.destDir, args.config, args.logger);
    await processDirectory(args.config.startDir, args.destDir, task, args.config, args.logger);
    await task('finish', null, args.destDir, args.config, args.logger);
}

module.exports = traverse_and_do_task;

