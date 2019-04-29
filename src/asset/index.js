/* eslint-disable no-console */
const createAsset = require('./create_asset');
const { checkinOneAsset, checkinAllAssets } = require('./checkin_asset');
const { checkoutOneAsset, checkoutAllAssets } = require('./checkout_asset');

function asset(command, args) {
  let startPath = './working_directory';
  switch (command) {
    case 'init':
      console.log('Command init not yet implemented');
      break;
    case 'create':
      createAsset(args);
      break;
    case 'checkout':
      startPath = args.getOption('start', './working_directory');
      if (args.argCount() === 1) {
        checkoutOneAsset(args.popArg(), startPath);
      } else if (args.getOption('all', false)) {
        checkoutAllAssets(startPath);
      } else {
        usageAndExit();
      }
      break;
    case 'checkin':
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
