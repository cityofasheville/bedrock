const fs = require('fs');
const logging = require('coa-node-logging');
require('dotenv').config();
const logger = logging.createLogger('JobRunner', null);
const commandLine = require('coa-command-line-args');
const Exception = require('./exceptions');
const initializeJobTracker = require('./jobs_tracker/initialize');
const countPoints = require('./jobs_tracker/count_points');

const usage = function usage() {
  const usageString = `Usage: ${commandLine.stripPath(process.argv[1])} working_directory`
                    + ' [--parallelLoad=load_points]'
                    + ' [--jobFile=job_file_name]'
                    + ' [--init]';
  console.log(usageString);
};

const args = commandLine.extractOptions(process.argv.slice(2));
if (args.args.length < 1) {
  logger.error({ args }, 'Invalid invocation of jobs_runner');
  usage();
  process.exit(1);
}

const loadPoints = ('parallelLoad' in args.options) ? args.options.parallelLoad : 2;
const jobFileName = ('jobFile' in args.options) ? args.options.jobFile : 'etl_jobs.json';
const workingDirectory = args.args[0];
const files = fs.readdirSync(workingDirectory);

if (files.indexOf(jobFileName) < 0) {
  logger.error(`Unable to find job file ${jobFileName} in jobs directory ${args.args[0]}`);
  process.exit(1);
}

/*
 * So the basic flow is this:
 *  - Read or create the job tracker
 *  - Check the status of running jobs, update the job tracker as needed
 *  - If there are open slots, start new jobs and add to running
 *  - Save out the current job tracker.
 */

// Read or create the job tracker
const jobTracker = initializeJobTracker(workingDirectory, files, jobFileName, args.options.init, logger);

 // Check the status of running jobs, update the job tracker as needed
const runningFiles = fs.readdirSync(`${workingDirectory}/jobs`);
jobTracker.running = jobTracker.running.filter((job) => {
  if (runningFiles.indexOf(job.name) < 0) {
    // Something is seriously wrong.
    logger.error({ job }, `Unable to find job file for running job ${job.name}`);
    process.exit(1);
  }
  const fd = fs.openSync(`${workingDirectory}/${jobFileName}`, 'r');
  const jobStatus = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
  fs.closeSync(fd);
  if (jobStatus.done) {
    jobTracker.jobStatus[job.name] = 'Done';
    fs.unlinkSync(`${workingDirectory}/${jobFileName}`);
    return null;
  }
  return job;
});

// If there are open slots, start new jobs and add to running
const currentLoad = jobTracker.running.reduce(countPoints, 0);
if (currentLoad < loadPoints) {
  // add some new jobs
  console.log('We have room for ' + (loadPoints - currentLoad) + ' jobs');
}

console.log(`The job file: ${JSON.stringify(jobTracker)}`);

// Save out the current job tracker.
const fd = fs.openSync(`${workingDirectory}/jobstatus.json`, 'w');
fs.writeFileSync(fd, JSON.stringify(jobTracker), { encoding: 'utf8' });
fs.closeSync(fd);
