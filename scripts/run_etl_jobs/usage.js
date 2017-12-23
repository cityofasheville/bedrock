/* eslint-disable no-console */
const { stripPath } = require('../common/utilities');

module.exports = function usageAndExit() {
  const usageString = '\nRun ETL jobs until done.\n\n'
                    + `Usage:\t${stripPath(process.argv[1])} working_directory`
                    + '\n\t\t[--parallelLoad=load_points]'
                    + '\n\t\t[--jobFile=job_file_name]'
                    + '\n\t\t[--logfile=logFilePath]';
  console.log(usageString);
  process.exit(1);
};
