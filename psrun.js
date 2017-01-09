const spawn = require('child_process').spawn;

const args = [
  '10',
];
const bat = require.resolve('./sleeper.bat');
// const options = {
//   cwd: 'C:\\Users\\ericjackson\\dev\\coa-managed-data', shell: false,
// };
const run = spawn(bat, args, { shell: true });


run.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

run.on('close', (code) => {
  console.log(`The child process ended with code ${code}`);
});

run.stdin.end();
console.log('Bi');
