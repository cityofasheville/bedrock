const fs = require('fs');
const Pool = require('pg-pool');

let data = [];
const metadataPath = './working_directory/metadata/' ;

function init(config) {
  if(config.schema){ //just schema
    if(config.oneAsset){
      data.push({ name: config.oneAsset });
    }else{
      data.push({ name: "Load_All_Asset_Schemas" });
    }
  } else if(config.metadata){ //just metadata
    if(fs.existsSync(metadataPath)){
      const files = fs.readdirSync(metadataPath);
      files.forEach(file => {
        const fileContent = readMetadataFile(file);
        const mda = {};
        mda.meta = JSON.parse(fileContent);
        mda.name = mda.meta.name;
        if(!config.oneAsset || config.oneAsset === mda.name){  //if running for all assets or this asset
          data.push(mda); 
        }
      });   
    }; 
  } 
}

function runForEachPath(path, logger, config) { 
  if(!config.schema && !config.metadata){
    try {
        const files = fs.readdirSync(path);
        if (files.indexOf('mda.json') >= 0) {
            const mdafd = fs.openSync(`${path}/mda.json`, 'r');
            const mda = JSON.parse(fs.readFileSync(mdafd, { encoding: 'utf8' }));
            if(!config.oneAsset || config.oneAsset === mda.name){  //if running for all assets or this asset
              //if this mda has a schema file (non-etl file)
              if(mda.schema && mda.schema.file){
                if (files.indexOf(mda.schema.file) >= 0) {
                  const filefd = fs.openSync(`${path}/${mda.schema.file}`, 'r');
                  const fileContent = fs.readFileSync(filefd, { encoding: 'utf8' })
                  mda.schema.fileContent = fileContent;
                }
              }

              if (files.indexOf('etl.json') >= 0) {
                const etlfd = fs.openSync(`${path}/etl.json`, 'r');
                const etl = JSON.parse(fs.readFileSync(etlfd, { encoding: 'utf8' }));
                //get file content (eg. *fmw or *sql)
                let categories = ['tasks','distribute','create'];
                categories.forEach(category => {
                  etl[category].forEach((task,ix) => {  
                    if (files.indexOf(task.file) >= 0) {
                      const filefd = fs.openSync(`${path}/${task.file}`, 'r');
                      const fileContent = fs.readFileSync(filefd, { encoding: 'utf8' })
                      etl[category][ix].fileContent = fileContent;
                    }
                  })                  
                });
                mda.etl = etl;      
              }

              if (fs.existsSync(`${metadataPath}${mda.name}.json`)) {
                mda.meta = readMetadataFile(`${mda.name}.json`);
              }

              mda.path = path.split('/assets/')[1]; // remove the "./working_directory/assets/"
              data.push(mda);
            }
        }
      } catch (err) {
        logger.error({ err }, `Error reading ${path}/mda.json`);
      }
    }
}

function readMetadataFile(filename){
  const metafd = fs.openSync(`${metadataPath}${filename}`, 'r');
  const fileContent = fs.readFileSync(metafd, { encoding: 'utf8' })
  return fileContent;
}
////////////////////////////////////////////////////////////////////////
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
    if(!config.oneAsset && !config.metadata && !config.schema){ // if we are doing all assets, clear tables first: there could be dropped assets
      clearTables(client);
    }
    data.forEach(asset=>{
      if(config.metadata){
        checkinMeta(asset, client);
      }else if(config.schema){
        loadSchemas(asset, client);
      }else{
        checkinAsset(asset, client);
      }
    });
    client.release();
  })
}

function clearTables(client){
        client.query('truncate table bedrock.assets')
  .then(client.query('truncate table bedrock.asset_files'))
  .then(client.query('truncate table bedrock.asset_depends'))
  .then(client.query('truncate table bedrock.etl_tasks'))
  .then(client.query('truncate table bedrock.schemas'))
  .then(client.query('truncate table bedrock.schema_columns'))
  .then(client.query('truncate table bedrock.metadata'))
  .catch(e => {console.error('query error', e.message, e.stack); });
}

function checkinAsset(asset, client){
  let sqllookup = 'SELECT id FROM bedrock.asset_locations WHERE short_name = $1;';
  client.query(sqllookup, [asset.location]).then(res => {
    if(!res.rows[0]){
      console.error('Invalid location ' + asset.location + ' for asset ' + asset.name);
      return;
    }else{
      if(!(asset.name&&res.rows[0].id&&asset.path&&asset.active&&asset.type)){
        console.log('Asset not complete: Required fields: (name, location, path, active, type) ', asset.name)
      }
      asset.loc_id = res.rows[0].id;
      let sqlInsert = 'INSERT INTO bedrock.assets(name, location, path, active, type, description)' +
                      ' VALUES ($1, $2, $3, $4, $5, $6)' + 
                      ' ON CONFLICT (name, location) DO UPDATE ' +
                      ' SET active = excluded.active, ' + 
                      '     type = excluded.type, ' +
                      '     description = excluded.description ' +
                      ' RETURNING id;'
      client.query(sqlInsert, [asset.name, asset.loc_id, asset.path, asset.active, asset.type, asset.description])
      .then(res => {
        asset.id = res.rows[0].id;
        checkinDep(asset, client);
        checkinEtl(asset, client);
        loadSchemas(asset, client);
        checkinMeta(asset, client);
        checkinFiles(asset, client);
      })
      .catch(e => {console.error('query error', e.message, e.stack); });
    }
  }) 
}

function checkinDep(asset, client){ 
  asset.depends && 
  (asset.depends.forEach(deprow=>{
    client.query('INSERT INTO bedrock.asset_depends("asset_id", "depends") VALUES ($1, $2) ' +
    'ON CONFLICT ("asset_id", "depends") DO NOTHING ', [ asset.id, deprow ])
      .catch(e => {console.error('query error', e.message, e.stack); });
  }));
  

}

function checkinEtl(asset, client){
  const etl = asset.etl;
  etl && Object.keys(etl).forEach(category => { //create,distribute,tasks
    etl[category].forEach((task,ix) => {
      let sqlInsertEtl = 'INSERT INTO bedrock.etl_tasks(asset_id, task_order, category, type, file, file_content, db, active) ' +
                         'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)' +
                         ' ON CONFLICT (asset_id, task_order) DO UPDATE ' +
                         ' SET category = excluded.category, ' + 
                         '     type = excluded.type, ' +
                         '     file = excluded.file, ' +                     
                         '     file_content = excluded.file_content, ' +                     
                         '     db = excluded.db, ' +                     
                         '     active = excluded.active ';                  
      client.query(sqlInsertEtl, [asset.id, ix, category, task.type, task.file, task.fileContent, task.db, task.active ])
      .catch(e => {console.error('query error', e.message, e.stack); });
    });
  });
}

function loadSchemas(asset, client){ 
  if(asset.name === "Load_All_Asset_Schemas"){
    let sqlInsertSchemaCol_All = 'INSERT INTO bedrock.schema_columns(' +
      'table_catalog, table_schema, table_name, column_name, ordinal_position, column_default, is_nullable, data_type, character_maximum_length, numeric_precision, numeric_precision_radix, numeric_scale, datetime_precision, interval_type, interval_precision) ' +
      'SELECT table_catalog, table_schema, table_name, column_name, ordinal_position, column_default, is_nullable, ' +
      'data_type, character_maximum_length, numeric_precision, numeric_precision_radix, ' +
      'numeric_scale, datetime_precision, interval_type, interval_precision ' +
      'FROM information_schema.columns where table_schema = $1;';
    client.query('DELETE FROM bedrock.schema_columns;')
    .then(client.query(sqlInsertSchemaCol_All, [ 'internal' ]))
    .catch(e => {console.error('query error', e.message, e.stack); });
  }else{
      let sqlInsertSchemaCol = 'INSERT INTO bedrock.schema_columns(' +
      'table_catalog, table_schema, table_name, column_name, ordinal_position, column_default, is_nullable, data_type, character_maximum_length, numeric_precision, numeric_precision_radix, numeric_scale, datetime_precision, interval_type, interval_precision) ' +
      'SELECT table_catalog, table_schema, table_name, column_name, ordinal_position, column_default, is_nullable, ' +
      'data_type, character_maximum_length, numeric_precision, numeric_precision_radix, ' +
      'numeric_scale, datetime_precision, interval_type, interval_precision ' +
      'FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2;';
    client.query('DELETE FROM bedrock.schema_columns WHERE table_name = $1;', [ asset.name ])
    .then(client.query('DELETE FROM bedrock.schemas WHERE table_name = $1;', [ asset.name ]))
    .then(client.query(sqlInsertSchemaCol, [ 'internal', asset.name ]))
    .then(client.query('INSERT INTO bedrock.schemas VALUES ($1, $2, NOW());', [ asset.name, asset.description ]))
    .catch(e => {console.error('query error', e.message, e.stack); });
  }
}

function checkinMeta(asset, client){ 
  asset.meta&&client.query('DELETE FROM bedrock.metadata WHERE name = $1', [ asset.name ])
    .then(res=>{client.query('INSERT INTO bedrock.metadata(name, json) VALUES ($1, $2)', [ asset.name, asset.meta ])
    })
    .catch(e => {console.error('query error', e.message, e.stack); });
}

function checkinFiles(asset, client){
  const schema = asset.schema;
  if(schema){
    let sqlInsertFiles = 'INSERT INTO bedrock.asset_files(asset_id, type, file, file_content) ' +
                        'VALUES ($1, $2, $3, $4)';                  
    client.query(sqlInsertFiles, [asset.id, schema.type, schema.file, schema.fileContent ])
    .catch(e => {console.error('query error', e.message, e.stack); });
  };
}

function processing(stage, path, dest, config, logger) {
  switch (stage) {
    case 'init':
      init(config);
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

