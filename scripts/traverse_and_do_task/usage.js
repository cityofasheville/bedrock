/* eslint-disable no-console */
const { stripPath } = require('../common/utilities');

module.exports = function usageAndExit(message = null) {
  const usageString = '\nTraverse directory hierarchy and run tasks on each data asset directory.\n\n'
                    + `Usage:\t${stripPath(process.argv[1])}`
                    + ' [list | etl | graphql | validate]'
                    + '\n\t\t[--start=startDir] [--dest=destDir]'
                    + '\n\t\t[--norecurse]'
                    + '\n\t\t[--logfile=logFilePath]'
                    + '\n\t\t[--indent=numberOfSpaces]';
  if (message) console.log(message);
  console.log(usageString);
  process.exit(1);
};
