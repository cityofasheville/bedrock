const Logger = require('coa-node-logging');

const logFile = process.env.logfile ? process.env.logfile : null;
const loggerName = process.env.loggerName ? process.env.loggerName : 'mda';
const logger = new Logger(loggerName, logFile);

module.exports = logger;
