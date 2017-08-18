/* eslint-disable no-console */
const spawnSync = require('child_process').spawnSync;
const fs = require('fs');

/* SAMPLE STATUS.JSON FILE
{
  "name":"coa_bc_address_master",
  "job":{
    "depends":[],
    "tasks":[
      {"type":"sql","file":"0-create-coa_bc_address_master-table.sql","db":"datastore1","active":true},
      {"type":"sql","file":"1-coa_bc_address_master_base.sql","db":"datastore1","active":false},
      {"type":"sql","file":"2-add_water_districts.sql","db":"datastore1","active":false},
      {"type":"sql","file":"3-add_trashday.sql","db":"datastore1","active":false},
      {"type":"sql","file":"4-update_river_district.sql","db":"datastore1","active":false}
    ]
  },
  "status":"Done"
}
*/

let fd = fs.openSync(`${process.argv[2]}/status.json`, 'r');
let status = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
fs.closeSync(fd);
status.status = 'Running';
console.log(`The job info is ${JSON.stringify(status.job)}`);
fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
fs.writeFileSync(fd, JSON.stringify(status), { encoding: 'utf8' });
fs.closeSync(fd);

const tasks = status.job.tasks;
for (let i = 0; i < tasks.length; i += 1) {
  let run;
  const task = tasks[i];
  if (task.type === 'sql') {

  } else if (task.type === 'fme') {
    run = spawnSync('fme', )
  }
}

const path = './sleeper.bat';
let bat = require.resolve(path);
const options = { detached: false, shell: false };
let args = [5, process.argv[2]];
if (status.job.type === 'fme') {
  bat = 'fme';
  args = [status.job.path];
} else if (status.job.type === 'sql') {
  bat = 'node';
}
console.log(new Date());
const run = spawn(bat, args, options);

run.on('close', code => {
  console.log(`The child process ended with code ${code}`);
  fd = fs.openSync(`${process.argv[2]}/status.json`, 'r');
  status = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
  fs.closeSync(fd);
  status.status = 'Done';
  fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
  fs.writeFileSync(fd, JSON.stringify(status), { encoding: 'utf8' });
  fs.closeSync(fd);
  console.log(new Date());
});
