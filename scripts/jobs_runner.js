const fs = require('fs');
const logging = require('coa-node-logging');
require('dotenv').config();
const logger = logging.createLogger('MDA', null);
const commandLine = require('coa-command-line-args');

