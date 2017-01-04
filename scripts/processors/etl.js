const fs = require('fs');

function readEtlConfig(path) {
  let etlConfig = null;
  const files = fs.readdirSync(path);
  const defIndex = files.indexOf('etl.json');
  if (defIndex >= 0) {
    const fd = fs.openSync(`${path}/etl.json`, 'r');
    etlConfig = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
  }
  return etlConfig;
}

let tree = {};

function addtoTree(config) {
  if (config) {
    console.log('Cofig is ' + JSON.stringify(config));
  }
  tree.it = config;
}

function validate(stage, path, dest, config, registerError) {
  switch (stage) {
    case 'init':
      tree = {};
      break;
    case 'run':
      addtoTree(readEtlConfig(path));
      break;
    case 'finish':
      break;
    default:
      break;
  }
}

module.exports = validate;
