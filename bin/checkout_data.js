const fs = require('fs');
const dotenv = require('dotenv');

// We must read the environment variables *before* we the require the connectionManager
if (fs.existsSync('./.env')) {
  dotenv.config({ path: './.env' });
} else {
  dotenv.config({ path: 'c:/coa/bedrock/.env' });
}

const connectionManager = require('../scripts/db/connection_manager');

function processAsset(obj) {
  const nobj = {};
  Object.keys(obj).forEach(mbr => {
    if (obj[mbr] && obj[mbr].constructor === Array) { // this should be temporary
      nobj[mbr] = obj[mbr].filter(itm => {
        return !(typeof itm === 'string' && itm.length === 0);
      });
    } else if (mbr.startsWith('geo_extent')) {
      if (!nobj.geographic_extent) nobj.geographic_extent = {};
      nobj.geographic_extent[mbr.substring(11)] = obj[mbr];
    } else {
      nobj[mbr] = obj[mbr];
    }
    if (mbr === 'tags') nobj.tag_len = nobj[mbr].length;
  });
  return nobj;
}

async function checkout_data() {
  const data = [];
  const client = connectionManager.getConnection('bedrock');
  let sqlAsset = `SELECT ast.id, ast.name, loc.short_name AS location, 
  ast.active, ast.type, ast.description, ast.category, ast.tags, ast.schema, ast.title, 
  ast.publication_date, ast.responsible_party,ast.responsible_party_role, ast.url, 
  ast.abstract, ast.status, ast.update_frequency, ast.keywords,ast.use_constraints, 
  ast.metadata_constraints, ast.resource_constraints, ast.topic_category, 
  ast.geo_extent_east, ast.geo_extent_west, ast.geo_extent_north, ast.geo_extent_south, 
  ast.feature_catalog, ast.process_description, ast.spatial_reference, 
  ast.metadata_creation_date, ast.contact_role_code FROM bedrock.assets ast
  INNER JOIN bedrock.asset_locations loc
  ON ast.location = loc.id; `;
  const assets = await client.query(sqlAsset);
  if (!assets.rows[0]) {
    console.log('No assets found');
  } else {  
    const assetObj = {};
    for (let i = 0; i < assets.rows.length; i += 1) {
      const asset = processAsset(assets.rows[i]);

      const dependsQuery = 'SELECT depends FROM bedrock.asset_depends where asset_id = $1';
      const depends = await client.query(dependsQuery, [asset.id]);
      asset.depends = depends.rows.map(itm => { return itm.depends; });

      assetObj.mda = asset;

      //write etl.json
      const etl = { tasks: [] };

      const sqlEtl = `SELECT etl_tasks.id, asset_id, task_order, 
      fromloc.short_name from_loc, from_table, 
      toloc.short_name to_loc, to_table
      FROM bedrock.etl_tasks
      INNER JOIN bedrock.asset_locations fromloc
      ON etl_tasks.from_loc_id = fromloc.id
      INNER JOIN bedrock.asset_locations toloc
      ON etl_tasks.to_loc_id = toloc.id
      WHERE asset_id = $1 ORDER BY task_order; `;
      const etlData = await client.query(sqlEtl, [asset.id]);
      if (etlData.rows[0]) {
        for (let k = 0; k < etlData.rows.length; k += 1) {
          const row = etlData.rows[k];
          etl.tasks.push(row);
        }
        assetObj.etl = etl;
      }
      data.push(assetObj);
    }
    return data;
  }
}

module.exports = checkout_data;