/* eslint-disable no-console */
const initDb = require('./init_db');

function bedrock(command, args) {
  if (command !== 'init') usageAndExit();
  initDb(args);
}

function usageAndExit() {
  console.log('Usage:\tbedrock bedrock init');
  process.exit(1);
}

module.exports = bedrock;
