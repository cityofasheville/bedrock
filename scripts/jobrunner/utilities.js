const fs = require('fs');

function recursivelyDeletePath(path) {
  const state = fs.lstatSync(path);
  if (state.isDirectory()) {
    const fileList = fs.readdirSync(path);
    fileList.forEach((file) => {
      if (file !== '.' && file !== '..') {
        recursivelyDeletePath(`${path}/${file}`);
      }
    });
    fs.rmdirSync(path);
  } else {
    fs.unlinkSync(path);
  }
}

function getJobPoints(job) {
  return ('points' in job) ? job.points : 1;
}

module.exports = {
  recursivelyDeletePath,
  getJobPoints,
};
