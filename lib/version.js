const cfg = require('../package.json');

const version = function () {
    return cfg.version;
}

module.exports = version;

