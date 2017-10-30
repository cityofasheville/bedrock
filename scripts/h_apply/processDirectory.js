const fs = require('fs');

module.exports = function processDirectory(path, dest, recurse, handler,
                                           config, logger) {
  const files = fs.readdirSync(path);
  const defIndex = files.indexOf('mda.json');
  if (defIndex >= 0) {
    const fd = fs.openSync(`${path}/mda.json`, 'r');
    const mda = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
    const lconfig = Object.assign({ mda }, config, { files });
    const p = handler('run', path, dest, lconfig, logger);
    Promise.resolve(p);
  }
  if (recurse) {
    files.forEach(fileName => {
      const fullPath = `${path}/${fileName}`;
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory() && recurse) {
        processDirectory(fullPath, dest, recurse, handler);
      }
    });
  }
};
