/* eslint-disable no-console, spaced-comment */
require('dotenv').config();
const fs = require('fs');
const Logger = require('coa-node-logging');
const { stripPath } = require('./common/utilities');
const CommandLineArgs = require('./common/CommandLineArgs');

const JobRunner = require('./etl_run/JobRunner');

const usage = function usage() {
  const usageString = '\nRun ETL jobs until done.\n\n'
                    + `Usage:\t${stripPath(process.argv[1])} working_directory`
                    + '\n\t\t[--parallelLoad=load_points]'
                    + '\n\t\t[--jobFile=job_file_name]'
                    + '\n\t\t[--logfile=logFilePath]';
  console.log(usageString);
  process.exit(1);
};

////////////////////////////////////
// Validate arguments & initialize
////////////////////////////////////

const args = new CommandLineArgs(process.argv.slice(2));
if (args.args.length < 1) usage();

const loadPoints = ('parallelLoad' in args.options) ? args.options.parallelLoad : 2;
const jobFileName = ('jobFile' in args.options) ? args.options.jobFile : 'etl_jobs_definition.json';
const jobFileDate = 'etl_jobs_date.json';
const workingDirectory = args.args[0];

const logger = new Logger('JobRunner', args.getOption('logfile', null));

// Test that we have what we need
const files = fs.readdirSync(workingDirectory);
if (files.indexOf(jobFileName) < 0 || files.indexOf(jobFileDate) < 0) {
  logger.error(`Unable to find job file ${jobFileName} or job date file etl_jobs_date.json in ${workingDirectory}`);
  process.exit(1);
}

// See if we need to re-initialize
let init = true;
if (files.indexOf('jobs_start.json') >= 0) {
  const generatedDate = JSON.parse(fs.readFileSync(`${workingDirectory}/etl_jobs_date.json`, { encoding: 'utf8' }));
  const startDate = JSON.parse(fs.readFileSync(`${workingDirectory}/jobs_start.json`, { encoding: 'utf8' }));
  if (Number(generatedDate.dateValue) < Number(startDate.dateValue)) init = false;
}
if (init) {
  // TODO: After we have status of run, need to generate error if not done.
  JobRunner.initializeJobTracker(workingDirectory, jobFileName, logger);
  const d = Date.now();
  const fd = fs.openSync(`${workingDirectory}/jobs_start.json`, 'w');
  fs.writeFileSync(fd, JSON.stringify({ dateValue: d, dateString: new Date(d).toISOString() }));
  fs.closeSync(fd);
}

// Now do the runs
const runner = new JobRunner(workingDirectory, jobFileName, logger);
runner.initializeRun();
runner.harvestRunningJobs();
runner.fillJobQueue(loadPoints);
process.exit(0);

