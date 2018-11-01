const fs = require('fs');
const Pool = require('pg-pool');

let data = [];

function init() {
  
}

function runForEachPath(path, logger, config) {
    try {
        const files = fs.readdirSync(path);
        const defIndex = files.indexOf('mda.json');
        if (defIndex >= 0) {
            const fd = fs.openSync(`${path}/mda.json`, 'r');
            const mda = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
            if(!config.oneasset || config.oneasset === mda.name){
              data.push(mda);
            }
        }
      } catch (err) {
        logger.error({ err }, `Error reading ${path}/mda.json`);
      }  
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
                    ' VALUES ($1, $2, $3, $4, $5) ON CONFLICT (name, location) DO UPDATE ' +
                    ' SET active = excluded.active, ' + 
                    '     type = excluded.type, ' +
                    '     description = excluded.description ' +
                    ' RETURNING id;'
          client.query(sqlinsert, [row.name,res.rows[0].id,row.active,row.type,row.description]).then(res => {
            row.depends.forEach(deprow=>{
              let sqlinsertdet = 'INSERT INTO bedrock.asset_depends(asset_id, depends) VALUES ($1, $2)';
              client.query(sqlinsertdet, [res.rows[0].id,deprow]);
            })
          })
          .catch(e => {
            //client.release();
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

