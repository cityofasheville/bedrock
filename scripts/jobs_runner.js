/* eslint-disable no-console */
const fs = require('fs');
const spawn = require('child_process').spawn;
const logging = require('coa-node-logging');
require('dotenv').config();
const logger = logging.createLogger('JobRunner', null);
const commandLine = require('coa-command-line-args');
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
let freeLoad = loadPoints - jobTracker.running.reduce(countPoints, 0);
console.log(`Freeload is ${freeLoad}`);
console.log(`seq: ${jobTracker.sequencedToDo.length}, free: ${jobTracker.freeToDo.length}`);
let jobsTodo = ((freeLoad > 0) &&
(jobTracker.sequencedToDo.length > 0 || jobTracker.freeToDo.length > 0));
while (jobsTodo) {
  let job;
  console.log(`Current sequencedToDo length: ${jobTracker.sequencedToDo.length}`);
  if (jobTracker.sequencedToDo.length > 0) {
    job = getNextSequencedJob(freeLoad);
    if (job) {
      if (job.job.type === null) { // just a sequencing dependency
        jobTracker.jobStatus[job.name] = 'Done';
        console.log(`Marking the job ${job.name} done.`);
      } else { // Start the job
        startJob(job);
        freeLoad -= getJobPoints(job);
      }
    } else jobsTodo = false;
  } else jobsTodo = false;
  console.log(`Bottom of the loop, jobsTodo = ${jobsTodo}, freeLoad = ${freeLoad}`);
  // Test points count
}

process.exit(0);

function startJob(job) {
  console.log(`Starting the job: ${JSON.stringify(job)}`);
  let runArgs = [];
  const options = { detached: true, stdio: ['ignore', fs.openSync('./out.log', 'a'), fs.openSync('./err.log', 'a')] };
  if (job.job.type === 'ps1') {
    runArgs = [job.job.path].concat(job.job.args);
  }
  const run = spawn('powershell.exe', runArgs, options);
  // run.stdout.on('data', (data) => {
  //   const fd = fs.openSync('./hi.log', 'w');
  //   fs.writeFileSync(fd, `stdout for ${job.name}: ${data}`, { encoding: 'utf8' });
  //   fs.close(fd);
  // });

  run.unref();
  jobTracker.running.push(job);
}

function seqDepends(accum, currentDepend) {
  let ok = true;
  if (jobTracker.jobStatus[currentDepend] !== 'Done') ok = false;
  if (currentDepend in jobTracker.refCount) {
    if (jobTracker.refCount[currentDepend] > 1) { // 1 because tester is one.
      ok = false;
    }
  }
  return ok && accum;
}

function regDepends(accum, currentDepend) {
  let ok = true;
  if (jobTracker.jobStatus[currentDepend] !== 'Done') ok = false;
  return ok && accum;
}

function getJobPoints(job) {
  return ('points' in job) ? job.points : 1;
}

function getNextSequencedJob(maxPts) {
  let jobToRun = null;
  console.log(`In getnextseq with points = ${maxPts}`);
  if (jobTracker.sequencedToDo.length > 0) {
    const job = jobTracker.sequencedToDo[0];
    const jpoints = getJobPoints(job);
    if (jpoints <= maxPts) {
      console.log(`Here is the job we are testing: ${job.name}`);
      if (job.job.type == null) { // Sequencing job
        // Only kick off when depends are both done and have refcount = 1 (me)
        if (job.job.depends.reduce(seqDepends, true)) {
          jobToRun = jobTracker.sequencedToDo.shift();
        }
      } else if (job.job.depends.reduce(regDepends, true)) {
        jobToRun = jobTracker.sequencedToDo.shift();
      }
    }
  }
  return jobToRun;
}

console.log(`The job file: ${JSON.stringify(jobTracker)}`);

// Save out the current job tracker.
const fd = fs.openSync(`${workingDirectory}/jobstatus.json`, 'w');
fs.writeFileSync(fd, JSON.stringify(jobTracker), { encoding: 'utf8' });
fs.closeSync(fd);
