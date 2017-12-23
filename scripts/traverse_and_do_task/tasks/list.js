/* eslint-disable no-console, spaced-comment */
const fs = require('fs');

function listAsset(path, logger) {
  let hasEtl = false;
  try {
    const files = fs.readdirSync(path);
    const defIndex = files.indexOf('etl.json');
    if (defIndex >= 0) hasEtl = true;
  } catch (err) {
    logger.error({ err }, `Error reading ${path}/etl.json`);
  }
  console.log(`${path} ${hasEtl ? 'ETL' : ''}`);
}

function process(stage, path, dest, mainConfig, logger) {
  switch (stage) {
    case 'run':
      listAsset(path, logger);
      break;

    default:
      break;
  }
}

module.exports = process;
