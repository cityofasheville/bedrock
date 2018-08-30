const fs = require('fs');
const Pool = require('pg-pool');

let data = [];

function init() {
  
}

function runForEachPath(path, logger) {
    try {
        const files = fs.readdirSync(path);
        const defIndex = files.indexOf('mda.json');
        if (defIndex >= 0) {
            const fd = fs.openSync(`${path}/mda.json`, 'r');
            const mda = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
            data.push(mda);
        }
      } catch (err) {
        logger.error({ err }, `Error reading ${path}/mda.json`);
      }  
}

function finish() {
  const dbConfig = {
      host: process.env.db1host,
      user: process.env.db1user,
      password: process.env.db1password,
      database: process.env.db1database,
      max: 10,
      idleTimeoutMillis: 10000,
    //  ssl: true,
  };
  var pool = new Pool(dbConfig)
  pool.connect().then(client => {
    client.query('truncate table mda_assetlist');
    client.query('truncate table mda_assetlist_depend');
    data.forEach(row=>{
      let sql = 'INSERT INTO mda_assetlist(name, active, type, description)' +
        ' VALUES ($1, $2, $3, $4) RETURNING id;'
      client.query(sql, [row.name,row.active?1:0,row.type,row.description]).then(res => {
        row.depends.forEach(deprow=>{
          sql = 'INSERT INTO mda_assetlist_depend(assetlist_id, depends) VALUES ($1, $2)';
          client.query(sql, [res.rows[0].id,deprow]);
        })
      })
      .catch(e => {
        client.release();
        console.error('query error', e.message, e.stack);
      })    
    });
    client.release();
  })
}

function processing(stage, path, dest, config, logger) {
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
module.exports = processing;

