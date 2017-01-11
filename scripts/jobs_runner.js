/* eslint-disable no-console */
const fs = require('fs');
// const spawn = require('child_process').spawn;
const fork = require('child_process').fork;
const logging = require('coa-node-logging');
require('dotenv').config();
const logger = logging.createLogger('JobRunner', null);
const commandLine = require('coa-command-line-args');
const jobTracker = require('./jobs_tracker/job_tracker');
const countPoints = require('./jobs_tracker/count_points');
const utilities = require('./jobs_tracker/utilities');
const recursivelyDeletePath = utilities.recursivelyDeletePath;

const usage = function usage() {
  const usageString = `Usage: ${commandLine.stripPath(process.argv[1])} working_directory`
                    + ' [--parallelLoad=load_points]'
                    + ' [--jobFile=job_file_name]'
                    + ' [--init]';
  console.log(usageString);
};

const args = commandLine.extractOptions(process.argv.slice(2));
if (args.args.length < 1) {
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
const jTracker = jobTracker.initializeJobTracker(workingDirectory, files, jobFileName, args.options.init, logger);

let fd;
 // Check the status of running jobs, update the job tracker as needed
const runningFiles = fs.readdirSync(`${workingDirectory}/jobs`);
jTracker.running = jTracker.running.filter((job) => {
  console.log(`Checking the status of running job ${job.name}`);
  if (runningFiles.indexOf(job.name) < 0) {
    // Something is seriously wrong.
    logger.error({ job }, `Unable to find job file for running job ${job.name}`);
    process.exit(1);
  }
  // TODO Read the status.json file in the workingdirectory/jobs/job.name
  fd = fs.openSync(`${workingDirectory}/jobs/${job.name}/status.json`, 'r');
  const jobStatus = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
  console.log(`Here is the job status: ${JSON.stringify(jobStatus)}`);
  fs.closeSync(fd);
  if (jobStatus.status === 'Done') {
    console.log(`THE JOB IS DONE!!!! - ${job.name}`);
    jTracker.jobStatus[job.name] = 'Done';
    job.job.depends.forEach((depName) => {
      jTracker.refCount[depName] -= 1;
    });
    jTracker.completed.push(job);
    return null;
  }
  return job;
});

fd = fs.openSync(`${workingDirectory}/jobstatus.json`, 'w');
fs.writeFileSync(fd, JSON.stringify(jTracker), { encoding: 'utf8' });
fs.closeSync(fd);

// If there are open slots, start new jobs and add to running
let freeLoad = loadPoints - jTracker.running.reduce(countPoints, 0);
console.log(`Freeload is ${freeLoad}`);
let jobsTodo = ((freeLoad > 0) && (jTracker.sequencedToDo.length > 0 || jTracker.freeToDo.length > 0));
while (jobsTodo) {
  let job;
  if (jTracker.sequencedToDo.length > 0) {
    job = getNextSequencedJob(freeLoad);
    if (job) {
      console.log(`Got the next sequenced job: ${job.name}`);
      if (job.job.type === null) { // just a sequencing dependency
        jTracker.jobStatus[job.name] = 'Done';
      } else { // Start the job
        startJob(job);
        const ffd = fs.openSync(`${workingDirectory}/jobstatus.json`, 'w');
        fs.writeFileSync(ffd, JSON.stringify(jTracker), { encoding: 'utf8' });
        fs.closeSync(ffd);
        freeLoad -= getJobPoints(job);
      }
    } else jobsTodo = false;
  } else jobsTodo = false;
  console.log(`Bottom of the loop, jobsTodo = ${jobsTodo}, freeLoad = ${freeLoad}`);
  // Test points count
}

process.exit(0);

function startJob(job) {
  const jobDir = `${workingDirectory}/jobs/${job.name}`;
  console.log(`Starting the job: ${JSON.stringify(job)}`);
  if (runningFiles.indexOf(job.name) >= 0) {
    console.log(`Delete directory ${workingDirectory}/jobs/${job.name}`);
    recursivelyDeletePath(`${workingDirectory}/jobs/${job.name}`);
  }
  fs.mkdirSync(jobDir);
  fd = fs.openSync(`${jobDir}/status.json`, 'w');
  fs.writeFileSync(fd, JSON.stringify({ name: job.name, job: job.job, status: 'Pending' }));
  fs.closeSync(fd);

  // Now fork a script that will run that job and write out the result at the end.
  const path = require.resolve('C:\\Users\\ericjackson\\dev\\coa-managed-data\\psrun.js');
  const out = fs.openSync(`${workingDirectory}/jobs/${job.name}/out.log`, 'a');
  const err = fs.openSync(`${workingDirectory}/jobs/${job.name}/err.log`, 'a');
  const options = { detached: true, shell: false, stdio: ['ignore', out, err, 'ipc'] };

  const run = fork(path, [jobDir], options);

  console.log(`Run data: ${run.pid}`);
  run.unref();
  jTracker.running.push(job);
  jTracker.jobStatus[job.name] = 'Started';
}

function seqDepends(accum, currentDepend) {
  let ok = true;
  if (jTracker.jobStatus[currentDepend] !== 'Done') ok = false;
  if (currentDepend in jTracker.refCount) {
    if (jTracker.refCount[currentDepend] > 1) { // 1 because tester is one.
      ok = false;
    }
  }
  return ok && accum;
}

function regDepends(accum, currentDepend) {
  let ok = true;
  if (jTracker.jobStatus[currentDepend] !== 'Done') ok = false;
  return ok && accum;
}

function getJobPoints(job) {
  return ('points' in job) ? job.points : 1;
}

function getNextSequencedJob(maxPts) {
  let jobToRun = null;
  console.log(`In getnextseq with points = ${maxPts}`);
  if (jTracker.sequencedToDo.length > 0) {
    const job = jTracker.sequencedToDo[0];
    const jpoints = getJobPoints(job);
    if (jpoints <= maxPts) {
      console.log(`Here is the job we are testing: ${job.name}`);
      if (job.job.type == null) { // Sequencing job
        // Only kick off when depends are both done and have refcount = 1 (me)
        if (job.job.depends.reduce(seqDepends, true)) {
          jobToRun = jTracker.sequencedToDo.shift();
        }
      } else if (job.job.depends.reduce(regDepends, true)) {
        jobToRun = jTracker.sequencedToDo.shift();
      }
    }
  }
  return jobToRun;
}

console.log(`The job file: ${JSON.stringify(jTracker)}`);

// Save out the current job tracker.
fd = fs.openSync(`${workingDirectory}/jobstatus.json`, 'w');
fs.writeFileSync(fd, JSON.stringify(jTracker), { encoding: 'utf8' });
fs.closeSync(fd);
