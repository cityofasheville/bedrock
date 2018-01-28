/* eslint-disable no-console, spaced-comment */
require('dotenv').config();
const processAndValidateArgs = require('./run_etl_jobs/processAndValidateArgs');
const createRunner = require('./run_etl_jobs/createRunner');

// Initialize
const args = processAndValidateArgs(process.argv.slice(2));
const runner = createRunner(args);

// Do the runs
args.logger.info('Initialize run');
runner.initializeRun();
args.logger.info('Harvest running jobs');
runner.harvestRunningJobs();
args.logger.info('Fill the job queue');
runner.fillJobQueue(args.loadPoints);
args.logger.info('Exit until the next time');
process.exit(0);

