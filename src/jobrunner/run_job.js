/* eslint-disable no-console */
const spawnSync = require('child_process').spawnSync;
const fs = require('fs');
const Logger = require('coa-node-logging');
const ConnectionManager = require('../db/connection_manager');
const connectionDefinitions = require('../connection_definitions');

const logger = new Logger('MDA', './mda.log');

const connectionManager = new ConnectionManager(connectionDefinitions, logger);

let fd = fs.openSync(`${process.argv[2]}/status.json`, 'r');
const job = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
fs.closeSync(fd);
const jobName = job.name;

job.status = 'Running';
fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
fs.writeFileSync(fd, JSON.stringify(job), { encoding: 'utf8' });
fs.closeSync(fd);

async function runSql(task) {
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
    return Promise.reject(`Query error: ${err.message}`);
  });
}

async function runTaskSequence(tasks) {
  let hasError = false;
  let errMessage = '';
  for (let i = 0; i < tasks.length && !hasError; i += 1) {
    const task = tasks[i];
    console.log(`${jobName}: Task ${i}, type ${task.type} - ${task.active ? 'Active' : 'Inactive'}`);
    if (task.active) {
      if (task.type === 'sql') {
        try {
          await runSql(task);
        } catch (err) {
          hasError = true;
          errMessage = err;
          logger.error(`Error running ${jobName} SQL job, file ${task.file}: ${err}`);
        }
      } else if (task.type === 'fme') {
        console.log('  Task type = FME');
        const bat = require.resolve('fme');
        const args = [task.file];
        try {
          console.log('      Run FME ...');
          const jobStatus = spawnSync(bat, args, { detached: false, shell: false });
          if (jobStatus.status !== 0) {
            throw new Error(jobStatus.error);
          }
          console.log('      Done.');
        } catch (err) {
          hasError = true;
          errMessage = err.message;
          console.log(`Error running ${jobName} FME job, file ${task.file}: ${JSON.stringify(err)}`);
          logger.error(`Error running ${jobName} FME job, file ${task.file}: ${JSON.stringify(err)}`);
        }
      }
    }
    console.log('     Done running the task');
  }
  if (hasError) {
    console.log('We have an error!');
    job.status = 'Error';
    fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify(job), { encoding: 'utf8' });
    fs.closeSync(fd);
    return Promise.reject(`Error running the job ${job.name}. ${errMessage}`);
  }
  return Promise.resolve('Done');
}

const tasks = job.job.tasks;
runTaskSequence(tasks)
.then(status => {
  job.status = status;
  fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
  fs.writeFileSync(fd, JSON.stringify(job), { encoding: 'utf8' });
  fs.closeSync(fd);
})
.catch(err => {
  console.log(`WHOA we gotta dam error ${err}`);
});

