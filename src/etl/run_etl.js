/* eslint-disable no-console, spaced-comment */
const { stripPath } = require('../common/utilities');
const logger = require('../common/logger');
const CommandLineArgs = require('../common/CommandLineArgs');
const createRunner = require('./run_etl_jobs/createRunner');

function runEtlJobs(args) {
  // Initialize
  const config = processAndValidateArgs(args);
  const runner = createRunner(config);

  // Do the runs
  runner.initializeRun();
  runner.harvestRunningJobs();
  runner.fillJobQueue(config.loadPoints);
  process.exit(0);
}

function processAndValidateArgs(argv) {
  console.log('start processing');
  const args = new CommandLineArgs(argv);
  if (args.argCount() < 1) usageAndExit();

  const config = {
    init: true,
    loadPoints: ('parallelLoad' in args.options) ? args.options.parallelLoad : 2,
    jobFileName: ('jobFile' in args.options) ? args.options.jobFile : 'etl_jobs_definition.json',
    jobFileDate: 'etl_jobs_date.json',
    workingDirectory: ('dest' in args.options) ? args.options.dest : './etl_jobs_dir',
    logger,
  };
  console.log('done with processing');
  return config;
}

function usageAndExit() {
  const usageString = '\nRun ETL jobs until done.\n\n'
                    + `Usage:\t${stripPath(process.argv[1])} working_directory`
                    + '\n\t\t[--parallelLoad=load_points]'
                    + '\n\t\t[--jobFile=job_file_name]'
                    + '\n\t\t[--logfile=logFilePath]';
  console.log(usageString);
  process.exit(1);
}

module.exports = runEtlJobs;
