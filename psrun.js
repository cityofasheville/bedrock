/* eslint-disable no-console */
const spawn = require('child_process').spawn;
const fs = require('fs');

let fd = fs.openSync(`${process.argv[2]}/status.json`, 'r');
let status = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
fs.closeSync(fd);
status.status = 'Running';
fd = fs.openSync(`${process.argv[2]}/status.json`, 'w');
fs.writeFileSync(fd, JSON.stringify(status), { encoding: 'utf8' });
fs.closeSync(fd);


let path = './sleeper.bat';
path = 'C:\\Users\\ericjackson\\dev\\coa-managed-data\\sleeper.bat';
const bat = require.resolve(path);
const options = { detached: false, shell: false };

console.log(new Date());
const run = spawn(bat, [10, process.argv[2]], options);

run.on('close', (code) => {
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

console.log('Bi');
