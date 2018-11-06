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
            if(!config.oneAsset || config.oneAsset === mda.name){  //if running for all assets or this asset
              if (files.indexOf('etl.json') >= 0) {
                const etlfd = fs.openSync(`${path}/etl.json`, 'r');
                const etl = JSON.parse(fs.readFileSync(etlfd, { encoding: 'utf8' }));
                etl.tasks.forEach((task,ix) => {  //get file content (eg. *fmw or *sql)
                  if (files.indexOf(task.file) >= 0) {
                    const filefd = fs.openSync(`${path}/${task.file}`, 'r');
                    const fileContent = fs.readFileSync(filefd, { encoding: 'utf8' })
                    etl.tasks[ix].fileContent = fileContent;
                  }
                })
                mda.etl = etl;              
              }
              const schemasPath = './working_directory/schemas/' ; // + path.slice(27);
              if (fs.existsSync(`${schemasPath}${mda.name}.sql`)) {
                const schemafd = fs.openSync(`${schemasPath}${mda.name}.sql`, 'r');
                const fileContent = fs.readFileSync(schemafd, { encoding: 'utf8' })
                mda.sql = fileContent;
              }
              mda.path = path.slice(27); // remove the ./working_directory/assets/
              data.push(mda);
            }
        }
      } catch (err) {
        logger.error({ err }, `Error reading ${path}/mda.json`);
      }
      // console.log(data);
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
    if(!config.oneAsset){ // if we are doing all assets, clear tables first: there could be dropped assets
      clearTables(client);
    }
    data.forEach(asset=>{
      checkinAsset(asset, client);
    });
    client.release();
  })
}

function clearTables(client){
  client.query('truncate table bedrock.assets');
  client.query('truncate table bedrock.asset_depends');
  client.query('truncate table bedrock.etl_tasks');
  client.query('truncate table bedrock.schemas');
  client.query('truncate table bedrock.schema_columns');
  // client.query('truncate table bedrock.metadata');
}

function checkinAsset(asset, client){
  let sqllookup = 'SELECT id FROM bedrock.asset_locations WHERE short_name = $1;';
  client.query(sqllookup, [asset.location]).then(res => {
    if(!res.rows[0]){
      console.error('Invalid location ' + asset.location + ' for asset ' + asset.name);
      return;
    }else{
      let sqlInsert = 'INSERT INTO bedrock.assets(name, location, path, active, type, description)' +
                      ' VALUES ($1, $2, $3, $4, $5, $6)' + 
                      ' ON CONFLICT (name, location) DO UPDATE ' +
                      ' SET active = excluded.active, ' + 
                      '     type = excluded.type, ' +
                      '     description = excluded.description ' +
                      ' RETURNING id;'
      client.query(sqlInsert, [asset.name, res.rows[0].id, asset.path, asset.active, asset.type, asset.description])
      .then(res => {
        checkinDep(asset, res, client);
        checkinEtl(asset, res, client);
      })
      .catch(e => {
        console.error('query error', e.message, e.stack);
      });
    }
  }) 
}

function checkinDep(asset, res, client){
  asset.depends.forEach(deprow=>{
    let sqlInsertDep = 'INSERT INTO bedrock.asset_depends(asset_id, depends) VALUES ($1, $2)';
    client.query(sqlInsertDep, [res.rows[0].id,deprow])
    .catch(e => {
      console.error('query error', e.message, e.stack);
    });
  });
}

function checkinEtl(asset, res, client){
  const etl = asset.etl;
  Object.keys(etl).forEach(category => { //create,distribute,tasks
    etl[category].forEach((task,ix) => {
      let sqlInsertEtl = 'INSERT INTO bedrock.etl_tasks(asset_id, task_order, category, type, file, file_content, db, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
      client.query(sqlInsertEtl, [res.rows[0].id, ix, category, task.type, task.file, task.fileContent, task.db, task.active ])
      .catch(e => {
        console.error('query error', e.message, e.stack);
      });
    });
  });
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

