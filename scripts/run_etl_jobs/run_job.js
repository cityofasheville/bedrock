/* eslint-disable no-console */
const { spawnSync } = require('child_process');
const fs = require('fs');
const logger = require('../common/logger');
const connectionManager = require('../db/connection_manager');

let fd = fs.openSync(`${process.argv[2]}/status.json`, 'r');
const job = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
fs.closeSync(fd);
const jobName = job.name;

job.status = 'Running';
fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
fs.writeFileSync(fd, JSON.stringify(job), { encoding: 'utf8' });
fs.closeSync(fd);

function runSql(task) {
  const filePath = (task.file[0] === '/') ? task.file : `${job.path}/${task.file}`;
  console.log(` Doing a SQL query from file ${filePath}`);
  const fdSql = fs.openSync(filePath, 'r');
  const sql = fs.readFileSync(fdSql, { encoding: 'utf8' });
  const cn = connectionManager.getConnection(task.db);

  return cn.query(sql)
    .then(res => {
      console.log(`Query done - result: ${JSON.stringify(res)}`);
      return res;
    })
    .catch(err => {
      return Promise.reject(new Error(`Query error: ${err.message}`));
    });
}

function runFme(task) {
  const fme = 'c:\\FME2017\\fme';
  const filePath = (task.file[0] === '/') ? task.file : `${job.path}/${task.file}`;
  console.log(` Doing an FME job from file ${filePath} in path ${job.path}`);
  const jobStatus = spawnSync(fme, [filePath], { detached: false, shell: false, cwd: job.path });
  if (jobStatus.status !== 0) {
    throw new Error(jobStatus.error);
  }
}

function runNode(task) {
  const node = 'c:/Progra~1/nodejs/node';
  const filePath = (task.file[0] === '/') ? task.file : `${job.path}/${task.file}`;
  console.log(` Doing a Node job from file ${filePath}`);
  const jobStatus = spawnSync(node, [filePath], { detached: false, shell: true, cwd: job.path });
  if (jobStatus.status !== 0) {
    throw new Error(jobStatus.error);
  }
}

function runBash(task) {
  const bash = 'C:/Progra~1/Git/usr/bin/bash.exe';
  const filePath = (task.file[0] === '/') ? task.file : `${job.path}/${task.file}`;
  console.log(` Doing a Bash job from file ${filePath} in path ${job.path}`);
  const jobStatus = spawnSync(bash, [filePath], { detached: false, shell: true, cwd: job.path });
  if (jobStatus.status !== 0) {
    throw new Error(jobStatus.error);
  }
}

function runExe(task) {
  const filePath = (task.file[0] === '/') ? task.file : `${job.path}/${task.file}`;
  console.log(` Doing an Exe job from file ${filePath}`);
  const jobStatus = spawnSync(filePath, { detached: false, shell: true, cwd: job.path });
  if (jobStatus.status !== 0) {
    throw new Error(jobStatus.error);
  }
}

async function runTaskSequence(seqName, tasks, endStatus = 'Done') {
  let hasError = false;
  let errMessage = '';
  console.log(`Running tasks ${seqName}: ${JSON.stringify(tasks)}`);
  for (let i = 0; tasks && i < tasks.length && !hasError; i += 1) {
    const task = tasks[i];
    console.log(`${seqName}:${jobName}: Task ${i}, type ${task.type} - ${task.active ? 'Active' : 'Inactive'}`);
    if (task.active) {
      if (task.type === 'sql') {
        try {
          // eslint-disable-next-line no-await-in-loop
          await runSql(task);
        } catch (err) {
          hasError = true;
          errMessage = err;
          logger.error(`Error running ${seqName}:${jobName} SQL job, file ${task.file}: ${err}`);
        }
      } else if (task.type === 'fme') {
        try {
          runFme(task);
        } catch (err) {
          hasError = true;
          errMessage = err.message;
          console.log(`Error running ${seqName}:${jobName} FME job, file ${task.file}: ${JSON.stringify(err)}`);
          logger.error(`Error running ${seqName}:${jobName} FME job, file ${task.file}: ${JSON.stringify(err)}`);
        }
      } else if (task.type === 'node') {
        try {
          runNode(task);
        } catch (err) {
          hasError = true;
          errMessage = err.message;
          console.log(`Error running ${seqName}:${jobName} Node job, file ${task.file}: ${JSON.stringify(err)}`);
          logger.error(`Error running ${seqName}:${jobName} Node job, file ${task.file}: ${JSON.stringify(err)}`);
        }
      } else if (task.type === 'exe') {
        try {
          runExe(task);
        } catch (err) {
          hasError = true;
          errMessage = err.message;
          console.log(`Error running ${seqName}:${jobName} Exe job, file ${task.file}: ${JSON.stringify(err)}`);
          logger.error(`Error running ${seqName}:${jobName} Exe job, file ${task.file}: ${JSON.stringify(err)}`);
        }
      } else if (task.type === 'bash') {
        try {
          runBash(task);
        } catch (err) {
          hasError = true;
          errMessage = err.message;
          console.log(`Error running ${seqName}:${jobName} Bash job, file ${task.file}: ${JSON.stringify(err)}`);
          logger.error(`Error running ${seqName}:${jobName} Bash job, file ${task.file}: ${JSON.stringify(err)}`);
        }
      }
    }
    console.log(`     Done running the ${seqName}:${jobName} task`);
  }
  if (hasError) {
    console.log('We have an error!');
    job.status = 'Error';
    fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify(job), { encoding: 'utf8' });
    fs.closeSync(fd);
    return Promise.reject(new Error(`Error running the job ${seqName}:${job.name}. ${errMessage}`));
  }
  return Promise.resolve(endStatus);
}

function recordJobStatus(jobStatus) {
  fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
  fs.writeFileSync(fd, JSON.stringify(jobStatus), { encoding: 'utf8' });
  fs.closeSync(fd);
}

console.log(`Here is the job: ${JSON.stringify(job.job)}`);
runTaskSequence('Create', job.job.create, 'Created')
  .then(status => {
    job.status = status;
    recordJobStatus(job);
    return runTaskSequence('Distribute', job.job.distribute, 'Distributed');
  })
  .then(status => {
    job.status = status;
    recordJobStatus(job);
    return runTaskSequence('Tasks', job.job.tasks, 'Done');
  })
  .then(status => {
    job.status = status;
    recordJobStatus(job);
  })
  .catch(err => {
    console.log(`Error running ${jobName}: ${err}`);
    logger.error(`Error running ${jobName}: ${JSON.stringify(err)}`);
    job.status = 'Error';
    recordJobStatus(job);
  });
