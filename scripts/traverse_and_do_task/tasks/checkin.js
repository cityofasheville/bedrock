/* eslint-disable no-console */
const fs = require('fs');
const connectionManager = require('../../db/connection_manager');

const data = [];

function init(config) {
  if (!config.oneAsset && !config.allAssets) {
    console.log('Asset name is required to checkin.');
    process.exit(1);
  } else if (config.allAssets) {
    console.log('Checking in all assets');
  }
}

function runForEachPath(path, logger, config) {
  try {
    const files = fs.readdirSync(path);
    if (files.indexOf('mda.json') >= 0) {
      const mdafd = fs.openSync(`${path}/mda.json`, 'r');
      const mda = JSON.parse(fs.readFileSync(mdafd, { encoding: 'utf8' }));
      if (config.allAssets || config.oneAsset === mda.name) { // if this asset
        if (files.indexOf('etl.json') >= 0) {
          const etlfd = fs.openSync(`${path}/etl.json`, 'r');
          const etl = JSON.parse(fs.readFileSync(etlfd, { encoding: 'utf8' }));
          // get file content (eg. *fmw or *sql)
          const categories = ['tasks', 'distribute', 'create'];
          categories.forEach(category => {
            if (etl[category]) {
              etl[category].forEach((task, ix) => {
                if (files.indexOf(task.file) >= 0) {
                  const filefd = fs.openSync(`${path}/${task.file}`, 'r');
                  const fileContent = fs.readFileSync(filefd, { encoding: 'utf8' });
                  etl[category][ix].fileContent = fileContent;
                }
              });
            }
          });
          /* Get object scripts and other files */
          if (mda.objects) {
            mda.objects.forEach((object, oIndex) => {
              if (object.aux) {
                object.aux.forEach((aux, aIndex) => {
                  if (aux.type === 'script' && aux.content && files.indexOf(aux.content) >= 0) {
                    const auxFd = fs.openSync(`${path}/${aux.content}`, 'r');
                    mda.objects[oIndex].aux[aIndex].content = fs.readFileSync(auxFd, { encoding: 'utf8' });
                    fs.closeSync(auxFd);
                  }
                });
              }
            });
          }
          mda.etl = etl;
        }
        data.push(mda);
      }
    }
  } catch (err) {
    logger.error({ err }, `Error reading ${path}/mda.json`);
  }
}

// //////////////////////////////////////////////////////////////////////
function finish(path) {
  const client = connectionManager.getConnection('bedrock');
  data.forEach(asset => {
    checkinAsset(asset, client, path);
  });
}

function checkinAsset(asset, client, path) {
  let assetID = null;
  const sqllookup = 'SELECT id FROM bedrock.asset_locations WHERE short_name = $1;';
  client.query(sqllookup, [asset.location]).then(res => {
    if (!res.rows[0]) {
      console.error('Invalid location "', asset.location, '" for asset ', asset.name);
    } else {
      if (!(asset.name && res.rows[0].id && asset.active && asset.type)) {
        console.log('Asset not complete: Required fields: (name, location, active, type) ', asset.name);
        return;
      }
      const locID = res.rows[0].id;
      const sqlInsert = 'INSERT INTO bedrock.assets( '
                      + ' name, location, active, type, description, category, tags, schema, title, publication_date, '
                      + ' responsible_party, responsible_party_role, url, abstract, status, update_frequency, keywords, '
                      + ' use_constraints, metadata_constraints, resource_constraints, topic_category, '
                      + ' geo_extent_east, geo_extent_west, geo_extent_north, geo_extent_south, '
                      + ' feature_catalog, '
                      + ' process_description, spatial_reference, metadata_creation_date, contact_role_code ) '
                      + ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, '
                      + ' $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)'
                      + ' ON CONFLICT (name, location) DO UPDATE SET '
                      + ' active = excluded.active, '
                      + ' type = excluded.type, '
                      + ' description = excluded.description, '
                      + ' category = excluded.category, '
                      + ' tags = excluded.tags, ' // []
                      + ' schema = excluded.schema, '
                      + ' title = excluded.title, '
                      + ' publication_date = excluded.publication_date, ' // date
                      + ' responsible_party = excluded.responsible_party, '
                      + ' responsible_party_role = excluded.responsible_party_role, '
                      + ' url = excluded.url, '
                      + ' abstract = excluded.abstract, '
                      + ' status = excluded.status, '
                      + ' update_frequency = excluded.update_frequency, '
                      + ' keywords = excluded.keywords, ' // []
                      + ' use_constraints = excluded.use_constraints, '
                      + ' metadata_constraints = excluded.metadata_constraints, ' // []
                      + ' resource_constraints = excluded.resource_constraints, '
                      + ' topic_category = excluded.topic_category, ' // []
                      + ' geo_extent_east = excluded.geo_extent_east, ' // float
                      + ' geo_extent_west = excluded.geo_extent_west, ' // float
                      + ' geo_extent_north = excluded.geo_extent_north, ' // float
                      + ' geo_extent_south = excluded.geo_extent_south, ' // float
                      + ' feature_catalog = excluded.feature_catalog, '
                      + ' process_description = excluded.process_description, '
                      + ' spatial_reference = excluded.spatial_reference, '
                      + ' metadata_creation_date = excluded.metadata_creation_date, ' // date
                      + ' contact_role_code = excluded.contact_role_code '
                      + ' RETURNING id;';
      client.query(sqlInsert, [asset.name, locID, asset.active, asset.type, asset.description, asset.category,
        arrToStr(asset.tags), asset.schema, asset.title, strToDate(asset.publication_date), asset.responsible_party,
        asset.responsible_party_role, asset.url, asset.abstract, asset.status, asset.update_frequency, arrToStr(asset.keywords),
        asset.use_constraints, arrToStr(asset.metadata_constraints), asset.resource_constraints, arrToStr(asset.topic_category),
        floatOrNull(asset.geographic_extent.east), floatOrNull(asset.geographic_extent.west),
        floatOrNull(asset.geographic_extent.north), floatOrNull(asset.geographic_extent.south),
        asset.feature_catalog, asset.process_description, asset.spatial_reference, strToDate(asset.metadata_creation_date), asset.contact_role_code,
      ])
        .then(res2 => {
          assetID = res2.rows[0].id;
          return checkinObjects(assetID, asset, client, path);
        })
        .then(() => {
          if (assetID !== null) {
            checkinDep(assetID, asset, client);
            checkinEtl(assetID, asset, client);
          }
        })
        .catch(e => { console.error('query error', e.message, e.stack); });
    }
  });
}

function arrToStr(arr) {
  if (arr && arr.length > 0) {
    return `{"${arr.join('","')}"}`;
  }
  return '{}';
}

function strToDate(str) {
  return str
    ? new Date(str)
    : null;
}

function floatOrNull(fl) {
  return fl || null;
}

async function checkinObjects(assetID, asset, client, path) {
  if (asset.objects) {
    await Promise.all(asset.objects.map(obj => {
      return client.query('INSERT INTO bedrock.asset_objects("asset_id", "name", "schema", "type", "blueprint") VALUES ($1, $2, $3, $4, $5) '
      + 'ON CONFLICT ("asset_id", "name") DO UPDATE SET '
      + 'schema = excluded.schema, type = excluded.type, blueprint = excluded.blueprint '
      + 'RETURNING id',
      [assetID, obj.name, obj.schema, obj.type, obj.blueprint])
        .then(result => {
          const objectId = result.rows[0].id;
          if (obj.aux && obj.aux.length > 0) {
            return Promise.all(obj.aux.map(auxItem => {
              return client.query('INSERT INTO bedrock.asset_object_aux_info("asset_object_id", "name", "description", "type", "subtype", "value") VALUES ($1, $2, $3, $4, $5, $6) '
              + 'ON CONFLICT("asset_object_id", "name") DO UPDATE SET '
              + 'description = excluded.description, type = excluded.type, subtype = excluded.subtype, value = excluded.value '
              + 'RETURNING asset_object_id',
              [objectId, auxItem.name, auxItem.description, auxItem.type, auxItem.subtype, auxItem.content])
                .then(auxResult => {
                  if (!auxResult.rows || auxResult.rows.length <= 0) {
                    throw new Error(`Failed to update asset object ${objectId} aux information.`);
                  }
                  return Promise.resolve(null);
                });
            }));
          }
          return Promise.resolve(null);
        })
        .catch(e => { console.error('query error', e.message, e.stack); });
    }));
  }
  return Promise.resolve(assetID);
}

function checkinDep(assetID, asset, client) {
  if (asset.depends) {
    asset.depends.forEach(deprow => {
      client.query('INSERT INTO bedrock.asset_depends("asset_id", "depends") VALUES ($1, $2) '
      + 'ON CONFLICT ("asset_id", "depends") DO NOTHING ', [assetID, deprow])
        .catch(e => { console.error('query error', e.message, e.stack); });
    });
  }
}

function checkinEtl(assetID, asset, client) {
  const { etl } = asset;
  if (etl) {
    Object.keys(etl).forEach(category => { // create,distribute,tasks
      etl[category].forEach((task, ix) => {
        const sqlInsertEtl = 'INSERT INTO bedrock.etl_tasks(asset_id, task_order, category, type, file, file_content, db, active) '
                          + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
                          + ' ON CONFLICT (asset_id, task_order) DO UPDATE '
                          + ' SET category = excluded.category, '
                          + '     type = excluded.type, '
                          + '     file = excluded.file, '
                          + '     file_content = excluded.file_content, '
                          + '     db = excluded.db, '
                          + '     active = excluded.active ';
        client.query(sqlInsertEtl, [assetID, ix, category, task.type, task.file, task.fileContent, task.db, task.active])
          .catch(e => { console.error('query error', e.message, e.stack); });
      });
    });
  }
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
      finish(path);
      break;
    default:
      break;
  }
}
module.exports = processing;
