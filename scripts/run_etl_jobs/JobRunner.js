/* eslint-disable no-console */
const fs = require('fs');
const { fork } = require('child_process');
const { getJobPoints, recursivelyDeletePath, countPoints } = require('./utilities');

class JobRunner {
  constructor(workDir, jobFileName, logger) {
    this.logger = logger;
    this.workDir = workDir;
    this.jobFileName = jobFileName;
    this.jTracker = JobRunner.emptyTracker();
    this.runningFiles = fs.readdirSync(`${this.workDir}/jobs`);
  }

  static emptyTracker() {
    return {
      startDate: new Date(),
      currentDate: new Date(),
      jobStatus: {},
      sequencedToDo: [],
      freeToDo: [],
      running: [],
      completed: [],
      errored: [],
    };
  }
  /*
   ***************************************************************************
   ***************************************************************************
     fillJobQueue - called each invocation
   ***************************************************************************
   ***************************************************************************
   */

  saveState(filename = null) {
    const fname = filename || 'jobs_status.json';
    const fd = fs.openSync(`${this.workDir}/${fname}`, 'w');
    fs.writeFileSync(fd, JSON.stringify(this.jTracker), { encoding: 'utf8' });
    fs.closeSync(fd);
  }

  startJob(job) {
    const jobDir = `${this.workDir}/jobs/${job.name}`;
    if (this.runningFiles.indexOf(job.name) >= 0) {
      // deletes files and dir in etl_jobs_dir/jobs/dirname
      recursivelyDeletePath(`${this.workDir}/jobs/${job.name}`);
    }
    fs.mkdirSync(jobDir);
    const fd = fs.openSync(`${jobDir}/status.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify({
      name: job.name, path: job.path, job: job.job, status: 'Pending',
    }));
    fs.closeSync(fd);

    // Now fork a script that will run that job and write out the result at the end.
    const path = require.resolve('./run_job.js');
    const out = fs.openSync(`${this.workDir}/jobs/${job.name}/out.log`, 'a');
    const err = fs.openSync(`${this.workDir}/jobs/${job.name}/err.log`, 'a');
    const options = { detached: true, shell: false, stdio: ['ignore', out, err, 'ipc'] };

    const run = fork(path, [jobDir], options);

    run.unref();

    this.jTracker.running.push(job);
    this.jTracker.jobStatus[job.name] = 'Started';
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
        if (job.job.depends.reduce(this.regDepends.bind(this), true)) {
          jobToRun = this.jTracker.sequencedToDo.shift();
        }
      }
    }
    return jobToRun;
  }

  fillJobQueue(loadPoints) {
    // If there are open slots, start new jobs and add to running
    let freeLoad = loadPoints - this.jTracker.running.reduce(countPoints, 0);
    // console.log(`Free load is ${freeLoad}.`);
    let jobsTodo = ((freeLoad > 0) && (this.jTracker.sequencedToDo.length > 0 || this.jTracker.freeToDo.length > 0));
    while (jobsTodo) {
      let job;
      let haveSequencedJobs = this.jTracker.sequencedToDo.length > 0;
      // We prefer to run jobs that others may depend on
      if (haveSequencedJobs) {
        job = this.getNextSequencedJob(freeLoad);
        if (job) {
          // console.log(`Got the next sequenced job: ${job.name}.`);
          if (job.job.type === null) { // just a sequencing dependency
            this.jTracker.jobStatus[job.name] = 'Done';
          } else { // Start the job
            this.startJob(job);
            this.saveState();
            freeLoad -= getJobPoints(job);
          }
        } else {
          haveSequencedJobs = false;
        }
      }
      if (freeLoad <= 0) {
        jobsTodo = false;
      } else if (!haveSequencedJobs) { // Can't run any more sequenced, get some free ones.
        const toRun = [];
        const holdJobs = [];
        // console.log('In !haveSequencedJobs');
        for (let i = 0; i < this.jTracker.freeToDo.length; i += 1) {
          const fjob = this.jTracker.freeToDo[i];
          if (getJobPoints(fjob) <= freeLoad) {
            toRun.push(fjob);
            freeLoad -= getJobPoints(fjob);
          } else {
            holdJobs.push(fjob);
          }
        }
        // console.log(`Running ${toRun.length} free jobs!`);
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

  /*
   ***************************************************************************
   ***************************************************************************
     harvestRunningJobs - called each invocation
   ***************************************************************************
   *************************************************************************** */

  purgeDependents(errorJob) {
    this.jTracker.sequencedToDo = this.jTracker.sequencedToDo.filter(job => {
      if (job.job.depends.reduce((accum, currentDepend) => { return (accum || errorJob === currentDepend); }, false)) {
        this.jTracker.errored.push(job);
        return false;
      }
      return true;
    });
  }

  harvestRunningJobs() {
    this.jTracker.running = this.jTracker.running.filter(job => {
      // Check the status of running job
      if (this.runningFiles.indexOf(job.name) < 0) {
        // Something is seriously wrong.
        this.logger.error(`Unable to find job file for running job ${job.name}`, { job });
        process.exit(1);
      }
      const fd = fs.openSync(`${this.workDir}/jobs/${job.name}/status.json`, 'r');
      const jobStatus = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
      fs.closeSync(fd);
      if (jobStatus.status === 'Done') {
        this.jTracker.jobStatus[job.name] = 'Done';
        this.jTracker.completed.push(job);
        return false;
      } if (jobStatus.status === 'Error') {
        this.jTracker.jobStatus[job.name] = 'Error';
        this.jTracker.errored.push(job);
        this.purgeDependents(job.name); // Pull off every job that depends on this one
        return false;
      }
      return true;
    });
    this.saveState();
  }

  /*
   ***************************************************************************
   ***************************************************************************
     initializeRun - called each invocation
   ***************************************************************************
   ************************************************************************** */

  loadJobTracker(workDir, jobFileName, logger) {
    this.jTracker = JobRunner.emptyTracker();
    const files = fs.readdirSync(workDir);

    if (files.indexOf('jobs_status.json') < 0) {
      logger.error(`Unable to find jobs_status.json in jobs directory ${workDir}`);
      process.exit(1);
    }
    const fd = fs.openSync(`${workDir}/jobs_status.json`, 'r');
    this.jTracker = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
    fs.closeSync(fd);
  }

  initializeRun() {
    this.loadJobTracker(this.workDir, this.jobFileName, this.logger);
  }

  /*
   ***************************************************************************
   ***************************************************************************
     Called once from createRunner.js when ETL processes are initialized
   ***************************************************************************
   ************************************************************************** */

  static initializeJobTracker(workDir, jobFileName, logger) {
    const jobTracker = JobRunner.emptyTracker();
    const files = fs.readdirSync(workDir);

    if (files.indexOf(jobFileName) < 0) {
      logger.error(`Unable to find job file ${jobFileName} in jobs directory ${workDir}`);
      process.exit(1);
    }

    let fd = fs.openSync(`${workDir}/${jobFileName}`, 'r');
    const jobsDef = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
    fs.closeSync(fd);

    // Let's just set up the dependencies by job name
    jobsDef.sequencedJobs.forEach(job => {
      if (!(job.name in jobTracker.jobStatus)) {
        jobTracker.jobStatus[job.name] = 'Not Started';
        jobTracker.sequencedToDo.push(job);
      }
    });
    jobsDef.freeJobs.forEach(job => {
      if (!(job.name in jobTracker.jobStatus)) {
        jobTracker.jobStatus[job.name] = 'Not Started';
        jobTracker.freeToDo.push(job);
      }
    });
    fd = fs.openSync(`${workDir}/jobs_status.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify(jobTracker), { encoding: 'utf8' });
    fs.closeSync(fd);

    if (files.indexOf('jobs') < 0) {
      fs.mkdirSync(`${workDir}/jobs`);
    } else {
      // TODO: We should delete all job files in the directory.
    }
  }
}

module.exports = JobRunner;
