/* eslint-disable no-console */
const fs = require('fs');

function createObjects(args) {
  if (args.argCount() < 1) {
    console.log(`argcount is ${args.argCount()}`);
    process.exit(1);
  }
  const assetName = args.getArg(0);
  const startDir = args.getOption('start', '.');

  if (!fs.existsSync(`${startDir}/${assetName}/mda.json`)) {
    console.error(`Asset ${assetName} not found`);
    process.exit(1);
  }
  console.log(`Create the objects for ${assetName}`);
}

function usageAndExit() {
  console.log('Usage:\tbedrock create <new_asset_name>\n\n');
  process.exit(1);
}

module.exports = createObjects;
