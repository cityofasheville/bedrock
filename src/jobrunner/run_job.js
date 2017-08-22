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
console.log(`The job info is ${JSON.stringify(job.job)}`);
fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
fs.writeFileSync(fd, JSON.stringify(job), { encoding: 'utf8' });
fs.closeSync(fd);

async function runSql(task) {
  const filePath = (task.file[0] === '/') ? task.file : `${job.path}/${task.file}`;
  console.log(` Doing a SQL query from file ${filePath}`);
  const fdSql = fs.openSync(filePath, 'r');
  const sql = fs.readFileSync(fdSql, { encoding: 'utf8' });
  console.log(` Read file ${filePath}, do the query`);
  const cn = connectionManager.getConnection(task.db);
  try {
    const result = await cn.query(sql);
    console.log(`Done with the query - pass back the result: ${JSON.stringify(result)}`);
    return result.then(res => {
      return res;
    })
    .catch(err => {
      return Promise.reject(`Got an error 1: ${JSON.stringify(err)}`);
    });
  } catch (err) {
    return Promise.reject(`Got an error 2: ${JSON.stringify(err)}`);
  }
}

async function runTaskSequence(tasks) {
  let hasError = false;
  for (let i = 0; i < tasks.length && !hasError; i += 1) {
    const task = tasks[i];
    console.log(`${jobName}: Task ${i} - ${task.active ? 'Active' : 'Inactive'}`);
    if (task.active) {
      if (task.type === 'sql') {
        console.log('  Task type = SQL');
        try {
          console.log('      Run SQL ...');
          await runSql(task);
          console.log('      Done.');
        } catch (err) {
          hasError = true;
          console.log(`Error running ${jobName} SQL job, file ${task.file}: ${err}`);
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
          console.log(`Error running ${jobName} FME job, file ${task.file}: ${JSON.stringify(err)}`);
          logger.error(`Error running ${jobName} FME job, file ${task.file}: ${JSON.stringify(err)}`);
        }
      }
    }
  }
  if (hasError) {
    console.log('We have an error!');
    console.error('Yup, we have an error');
    job.status = 'Error';
    fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify(job), { encoding: 'utf8' });
    fs.closeSync(fd);
    return Promise.reject(`Error running the job ${job.name}`);
  }
  return Promise.resolve(true);
}

const tasks = job.job.tasks;
runTaskSequence(tasks)
.then(whatever => {
  console.log(`Done: ${JSON.stringify(whatever)}`);
})
.catch(err => {
  console.log(`WHOA we gotta dam error ${err}`);
});

