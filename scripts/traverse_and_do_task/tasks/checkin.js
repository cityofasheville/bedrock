const fs = require('fs');
const Pool = require('pg-pool');

let data = [];

function init() {
  
}

function runForEachPath(path, logger, config) {
    try {
        const files = fs.readdirSync(path);
        if (files.indexOf('mda.json') >= 0) {
            const mdafd = fs.openSync(`${path}/mda.json`, 'r');
            const mda = JSON.parse(fs.readFileSync(mdafd, { encoding: 'utf8' }));
            if(!config.oneasset || config.oneasset === mda.name){
              if (files.indexOf('etl.json') >= 0) {
                const etlfd = fs.openSync(`${path}/etl.json`, 'r');
                const etl = JSON.parse(fs.readFileSync(etlfd, { encoding: 'utf8' }));
                etl.tasks.forEach((task,ix) => {
                  if (files.indexOf(task.file) >= 0) {
                    const filefd = fs.openSync(`${path}/${task.file}`, 'r');
                    const file_content = fs.readFileSync(filefd, { encoding: 'utf8' })
                    etl.tasks[ix].file_content = file_content;
                  }
                })
                mda.etl = etl;              
              }
              data.push(mda);
            }
        }
      } catch (err) {
        logger.error({ err }, `Error reading ${path}/mda.json`);
      }
      console.log(data);
}

function finish(config) {
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
    if(!config.oneasset){ // if we are doing all assets, clear tables first: there could be dropped assets
      client.query('truncate table bedrock.assets');
      client.query('truncate table bedrock.asset_depends');
      client.query('truncate table bedrock.etl_tasks');
    }
    data.forEach(row=>{
      let sqllookup = 'SELECT id FROM bedrock.asset_locations WHERE short_name = $1;';
      client.query(sqllookup, [row.location]).then(res => {
        if(!res.rows[0]){
          console.error('Invalid location ' + row.location + ' for asset ' + row.name + '\nValid Entries:');
          client.query('SELECT short_name FROM bedrock.asset_locations;').then(res => {
            res.rows.forEach(row => {
              console.error(row.short_name);
            })
          })
          return;
        }else{
          let sqlinsert = 'INSERT INTO bedrock.assets(name, location, active, type, description)' +
                          ' VALUES ($1, $2, $3, $4, $5)' + 
                          ' ON CONFLICT (name, location) DO UPDATE ' +
                          ' SET active = excluded.active, ' + 
                          '     type = excluded.type, ' +
                          '     description = excluded.description ' +
                          ' RETURNING id;'
          client.query(sqlinsert, [row.name, res.rows[0].id, row.active, row.type, row.description])
          .then(res => {
            row.depends.forEach(deprow=>{
              let sqlinsertdep = 'INSERT INTO bedrock.asset_depends(asset_id, depends) VALUES ($1, $2)';
              client.query(sqlinsertdep, [res.rows[0].id,deprow]);
            });
            row.etl.tasks.forEach((task,ix) => {
              let sqlinsertetl = 'INSERT INTO bedrock.etl_tasks(asset_id, task_order, type, file, file_content, db, active) VALUES ($1, $2, $3, $4, $5, $6, $7)';
              client.query(sqlinsertetl, [res.rows[0].id, ix, task.type, task.file, task.file_content, task.db, task.active ]);
            })
          })
          .catch(e => {
            client.release();
            console.error('query error', e.message, e.stack);
          })
        }
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
      runForEachPath(path, logger, config);
      break;
    case 'finish':
      finish(config);
      break;
    default:
      break;
  }
}
module.exports = processing;

