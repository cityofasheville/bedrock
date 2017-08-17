/* eslint-disable no-console */
const spawn = require('child_process').spawn;
const fs = require('fs');

let fd = fs.openSync(`${process.argv[2]}/status.json`, 'r');
let status = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
fs.closeSync(fd);
status.status = 'Running';
console.log(`The job info is ${JSON.stringify(status.job)}`);
fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
fs.writeFileSync(fd, JSON.stringify(status), { encoding: 'utf8' });
fs.closeSync(fd);

const path = './sleeper.bat';
let bat = require.resolve(path);
const options = { detached: false, shell: false };
let args = [5, process.argv[2]];
if (status.job.type === 'fme') {
  bat = 'fme';
  args = [status.job.path];
} else if (status.job.type === 'sql') {
  
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
