/* eslint-disable no-console */
const fs = require('fs');
const fork = require('child_process').fork;
const { getJobPoints, recursivelyDeletePath, countPoints } = require('./utilities');
const initializeJobTracker = require('./initialize_job_tracker');

class JobTracker {
  constructor(workingDirectory, jobFileName, reset, logger) {
    this.logger = logger;
    this.workingDirectory = workingDirectory;
    this.jobFileName = jobFileName;
    this.reset = reset;
    this.jTracker = {};
    this.runningFiles = fs.readdirSync(`${this.workingDirectory}/jobs`);
  }

  initializeRun() {
    this.jTracker = initializeJobTracker(this.workingDirectory, this.jobFileName, this.reset, this.logger);
  }

  harvestRunningJobs() {
    this.jTracker.running = this.jTracker.running.filter((job) => {
      console.log(`Checking the status of running job ${job.name}`);
      if (this.runningFiles.indexOf(job.name) < 0) {
        // Something is seriously wrong.
        this.logger.error({ job }, `Unable to find job file for running job ${job.name}`);
        process.exit(1);
      }
      const fd = fs.openSync(`${this.workingDirectory}/jobs/${job.name}/status.json`, 'r');
      const jobStatus = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
      fs.closeSync(fd);
      if (jobStatus.status === 'Done') {
        console.log(`Job ${job.name} is done!`);
        this.jTracker.jobStatus[job.name] = 'Done';
        job.job.depends.forEach((depName) => {
          this.jTracker.refCount[depName] -= 1;
        });
        this.jTracker.completed.push(job);
        return null;
      }
      return job;
    });
    this.saveState();
  }

  saveState() {
    const fd = fs.openSync(`${this.workingDirectory}/jobstatus.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify(this.jTracker), { encoding: 'utf8' });
    fs.closeSync(fd);
  }

  fillJobQueue(loadPoints) {
    // If there are open slots, start new jobs and add to running
    let freeLoad = loadPoints - this.jTracker.running.reduce(countPoints, 0);
    console.log(`Freeload is ${freeLoad}`);
    let jobsTodo = ((freeLoad > 0) && (this.jTracker.sequencedToDo.length > 0 || this.jTracker.freeToDo.length > 0));
    while (jobsTodo) {
      let job;
      let haveSequencedJobs = this.jTracker.sequencedToDo.length > 0;
      if (haveSequencedJobs) {
        job = this.getNextSequencedJob(freeLoad);
        if (job) {
          console.log(`Got the next sequenced job: ${job.name}`);
          if (job.job.type === null) { // just a sequencing dependency
            this.jTracker.jobStatus[job.name] = 'Done';
          } else { // Start the job
            this.startJob(job);
            this.saveState();
            freeLoad -= getJobPoints(job);
          }
        } else {
          haveSequencedJobs = false;
          console.log('No more sequenced jobs to do');
        }
      }
      if (!haveSequencedJobs) { // Can't run any more sequenced, get some free ones.
        const toRun = [];
        const holdJobs = [];
        for (let i = 0; i < this.jTracker.freeToDo.length; i += 1) {
          const fjob = this.jTracker.freeToDo[i];
          if (getJobPoints(fjob) <= freeLoad) {
            toRun.push(fjob);
            freeLoad -= getJobPoints(fjob);
          } else {
            holdJobs.push(fjob);
          }
        }
        console.log(`Running ${toRun.length} free jobs!`);
        this.jTracker.freeToDo = holdJobs;
        while (toRun.length > 0) {
          job = toRun.shift();
          this.startJob(job);
        }
        jobsTodo = false;
        this.saveState();
      }
    }
  }

  // Sequencing-only dependencies are special.
  seqDepends(accum, currentDepend) {
    let ok = this.jTracker.jobStatus[currentDepend] === 'Done';
    if (currentDepend in this.jTracker.refCount) {
      if (this.jTracker.refCount[currentDepend] > 1) { // 1 because tester is one.
        ok = false;
      }
    }
    return ok && accum;
  }

  regDepends(accum, currentDepend) {
    return (this.jTracker.jobStatus[currentDepend] === 'Done') && accum;
  }

  getNextSequencedJob(maxPts) {
    let jobToRun = null;
    if (this.jTracker.sequencedToDo.length > 0) {
      const job = this.jTracker.sequencedToDo[0];
      const jpoints = getJobPoints(job);
      if (jpoints <= maxPts) {
        if (job.job.type == null) { // Sequencing job
          // Only kick off when depends are both done and have refcount = 1 (me)
          if (job.job.depends.reduce(this.seqDepends.bind(this), true)) {
            jobToRun = this.jTracker.sequencedToDo.shift();
          }
        } else if (job.job.depends.reduce(this.regDepends.bind(this), true)) {
          jobToRun = this.jTracker.sequencedToDo.shift();
        }
      }
    }
    return jobToRun;
  }

  startJob(job) {
    const jobDir = `${this.workingDirectory}/jobs/${job.name}`;
    console.log(`Starting the job: ${JSON.stringify(job)}`);
    if (this.runningFiles.indexOf(job.name) >= 0) {
      console.log(`Delete directory ${this.workingDirectory}/jobs/${job.name}`);
      recursivelyDeletePath(`${this.workingDirectory}/jobs/${job.name}`);
    }
    fs.mkdirSync(jobDir);
    const fd = fs.openSync(`${jobDir}/status.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify({ name: job.name, job: job.job, status: 'Pending' }));
    fs.closeSync(fd);

    // Now fork a script that will run that job and write out the result at the end.
    const path = require.resolve('C:\\Users\\ericjackson\\dev\\coa-managed-data\\psrun.js');
    const out = fs.openSync(`${this.workingDirectory}/jobs/${job.name}/out.log`, 'a');
    const err = fs.openSync(`${this.workingDirectory}/jobs/${job.name}/err.log`, 'a');
    const options = { detached: true, shell: false, stdio: ['ignore', out, err, 'ipc'] };

    const run = fork(path, [jobDir], options);

    run.unref();
    this.jTracker.running.push(job);
    this.jTracker.jobStatus[job.name] = 'Started';
  }
}

module.exports = JobTracker;

