/* eslint-disable no-console, spaced-comment */
const fs = require('fs');
const Pool = require('pg-pool');
require('dotenv').config({path: 'C:/COA/complexcity/.env'});
// const ConnectionManager = require('../../db/connection_manager');
// const connectionDefinitions = require('../../run_etl_jobs/connection_definitions');

function runForEachPath(path, logger) {
  try {
    const files = fs.readdirSync(path);
    const defIndex = files.indexOf('mda.json');
    if (defIndex >= 0) {
        const fd = fs.openSync(`${path}/mda.json`, 'r');
        const Mda = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
        console.log("Path: ",path);
        if(Mda.depends.length>0){
          console.log(path,Mda.depends[0]);
        }
    }
  } catch (err) {
    logger.error({ err }, `Error reading ${path}/mda.json`);
  }
   console.log(`${path}`);
}

function init() {
  
}

async function finish() {
  const dbConfig = {
    host: process.env.wh1host,
    user: process.env.wh1user,
    password: process.env.wh1password,
    database: process.env.wh1database,
    max: 10,
    idleTimeoutMillis: 10000,
  //  ssl: true,
  };
  var pool = new Pool(dbConfig)
  pool.connect().then(client => {
    client.query('select $1::text as name', ['pg-pool']).then(res => {
      client.release()
      console.log('hello from', res.rows[0].name)
    })
    .catch(e => {
      client.release()
      console.error('query error', e.message, e.stack)
    })
  })

}

function process(stage, path, dest, mainConfig, logger) {
    switch (stage) {
        case 'init':
          init();
          break;
        case 'run':
          runForEachPath(path, logger);
          break;
        case 'finish':
          finish();
          break;
        default:
          break;
      }
}

module.exports = process;
