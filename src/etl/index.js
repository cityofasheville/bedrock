/* eslint-disable no-console */
const initEtl = require('./init_etl');
const runEtl = require('./run_etl');

function etl(command, args) {
  switch (command) {
    case 'init':
      initEtl(args);
      break;
    case 'run':
      runEtl(args);
      break;
    default:
      usageAndExit();
  }
}

function usageAndExit() {
  console.log('Usage:\tbedrock etl [init | run]');
  process.exit(1);
}

module.exports = etl;
