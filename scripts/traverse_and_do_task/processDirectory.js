const fs = require('fs');

module.exports = function processDirectory(path, dest, handler, config, logger) {
  const files = fs.readdirSync(path);
  const defIndex = files.indexOf('mda.json');
  if (defIndex >= 0) {
    const fd = fs.openSync(`${path}/mda.json`, 'r');
    const mda = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
    if (mda.active) {
      const lconfig = Object.assign({ mda }, config, { files });
      const p = handler('run', path, dest, lconfig, logger);
      Promise.resolve(p);
    }
  }

  if (config.recurse) {
    files.forEach(fileName => {
      const fullPath = `${path}/${fileName}`;
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory() && config.recurse) {
        processDirectory(fullPath, dest, handler, config, logger);
      }
    });
  }
};
