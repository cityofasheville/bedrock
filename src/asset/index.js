/* eslint-disable no-console */
const createAsset = require('./create_asset');
const { checkinOneAsset, checkinAllAssets } = require('./checkin_asset');

function asset(command, args) {
  console.log(JSON.stringify(args));
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
      console.log(`Checkin arg count = ${args.argCount()}`);
      console.log(`Value of option all is ${args.getOption('all')}`);
      if (args.argCount() === 1) {
        checkinOneAsset(args.popArg(), args);
      } else if (args.getOption('all', false)) {
        checkinAllAssets(args);
      } else {
        usageAndExit();
      }
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
  console.log('Usage:\tbedrock asset command [--all --start=directory]');
  process.exit(1);
}

module.exports = asset;
