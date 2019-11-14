const cfg = require('../../package.json');

const version = () => {
  return cfg.version;
};

module.exports = version;
