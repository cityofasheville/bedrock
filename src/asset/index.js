/* eslint-disable no-console */
const createAsset = require('./create_asset');

function asset(command, args) {
  switch (command) {
    case 'init':
      console.log('Command init not yet implemented');
      break;
    case 'create':
      createAsset(args);
      break;
    case 'checkout':
      console.log('Command checkout not yet implemented');
      break;
    case 'checkin':
      console.log('Command checkin not yet implemented');
      break;
    case 'delete':
      console.log('Command delete not yet implemented');
      break;
    default:
      console.log(`Unknown asset command ${command}`);
      usageAndExit();
  }
}


function usageAndExit() {
  console.log('Usage:\tbedrock asset command args');
  process.exit(1);
}

module.exports = asset;
