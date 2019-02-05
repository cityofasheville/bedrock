/* eslint-disable no-console, spaced-comment */
const fs = require('fs');
const CommandLineArgs = require('./common/CommandLineArgs');
const connectionManager = require('./db/connection_manager');

async function checkout() {
  const args = new CommandLineArgs(process.argv.slice(2));
  //TODO if (args.argCount() < 1) usageAndExit();
  const oneAsset = args.getArg(1);
  const startDir = args.getOption('start', '.');
  const blueprintMap = {};

  const client = connectionManager.getConnection('bedrock');
  let sqlAsset = 'SELECT ast.id, ast.name, loc.short_name AS location, ast.active, ast.type, ast.description, ast.category,  '
  + 'ast.tags, array_length(ast.tags, 1) tag_len, ast.schema, ast.title, ast.publication_date, ast.responsible_party, '
  + 'ast.responsible_party_role, ast.url, ast.abstract, ast.status, ast.update_frequency, ast.keywords, '
  + 'ast.use_constraints, ast.metadata_constraints, ast.resource_constraints, ast.topic_category,  '
  + 'ast.geo_extent_east, ast.geo_extent_west, ast.geo_extent_north, ast.geo_extent_south, ast.feature_catalog,  '
  + 'ast.process_description, ast.spatial_reference, ast.metadata_creation_date, ast.contact_role_code '
  + 'FROM bedrock.assets ast '
  + 'INNER JOIN bedrock.asset_locations loc '
  + 'ON ast.location = loc.id ';
  const queryArgs = [];
  if (oneAsset) {
    sqlAsset += 'WHERE ast.name = $1 ';
    queryArgs.push(oneAsset);
  }
  const assets = await client.query(sqlAsset, queryArgs);

  if (!assets.rows[0]) {
    console.log('No assets found');
  } else {
    for (let i = 0; i < assets.rows.length; i += 1) { // const asset of assets.rows) {
      const asset = assets.rows[i];
      const fullpath = `${startDir}/${asset.name}`;
      if (!fs.existsSync(fullpath)) { fs.mkdirSync(fullpath); }
      //write mda.json
      const sqlObjects = 'SELECT name, schema, type, blueprint FROM bedrock.asset_objects WHERE asset_id = $1';
      const objs = await client.query(sqlObjects, [asset.id]);
      const nObj = objs.rows.length;

      objs.rows.forEach(obj => {
        if (obj.blueprint && obj.blueprint.length > 0) blueprintMap[obj.blueprint] = true;
      });
      const objString = objs.rows.reduce((accum, row, idx) => {
        const item = `    {
      "name": "${row.name}",
      "type": "${row.type}",
      "schema": "${row.schema}",
      "blueprint": "${row.blueprint}"
    }${(idx === nObj - 1) ? '\n' : ',\n'}`;
        return accum + item;
      }, '');

      const dependArray = [];
      const sqlDepends = 'SELECT depends FROM bedrock.asset_depends where asset_id = $1';
      const depends = await client.query(sqlDepends, [asset.id]);
      for (let j = 0; j < depends.rows.length; j += 1) { // (const depend of depends.rows) {
        const depend = depends.rows[j];
        dependArray.push(`\n    "${depend.depends}"`);
      }
      const dependList = dependArray.length > 0 ? `[${dependArray.join(',')}\n  ]` : '[]';

      let mdaStr = '{\n'
    + `  "name": "${asset.name}",\n`
    + `  "location": "${asset.location}",\n`
    + `  "active": ${asset.active},\n`
    + `  "type": "${asset.type}",\n`
    + `  "description": "${asset.description}",\n`
    + `  "depends": ${dependList},\n`
    + `  "category": "${asset.category}",\n`
    + `  "tags": ${arrToStr(asset.tags)},\n`
    + `  "objects": [\n`
    + objString
    + `  ],\n`
    + `  "schema": "${asset.schema}",\n`
    + `  "title": "${asset.title}",\n`
    + `  "publication_date": "${dateToStr(asset.publication_date)}",\n`
    + `  "responsible_party": "${asset.responsible_party}",\n`
    + `  "responsible_party_role": "${asset.responsible_party_role}",\n`
    + `  "url": "${asset.url}",\n`
    + `  "abstract": "${asset.abstract}",\n`
    + `  "status": "${asset.status}",\n`
    + `  "update_frequency": "${asset.update_frequency}",\n`
    + `  "keywords": ${arrToStr(asset.keywords)},\n`
    + `  "use_constraints": "${asset.use_constraints}",\n`
    + `  "metadata_constraints": ${arrToStr(asset.metadata_constraints)},\n`
    + `  "resource_constraints": "${asset.resource_constraints}",\n`
    + `  "topic_category": ${arrToStr(asset.topic_category)},\n`
    + '  "geographic_extent" : {\n'
    + `      "east": "${asset.geo_extent_east}",\n`
    + `      "west": "${asset.geo_extent_west}",\n`
    + `      "north": "${asset.geo_extent_north}",\n`
    + `      "south": "${asset.geo_extent_south}"\n  },\n`
    + `  "feature_catalog": "${asset.feature_catalog}",\n`
    + `  "process_description": "${asset.process_description}",\n`
    + `  "spatial_reference": "${asset.spatial_reference}",\n`
    + `  "metadata_creation_date": "${dateToStr(asset.metadata_creation_date)}",\n`
    + `  "contact_role_code": "${asset.contact_role_code}"\n}`;

      mdaStr = mdaStr.replace(/"null"(,?)\n/g, '""$1\n');
      const fileDataMda = new Uint8Array(Buffer.from(mdaStr));
      fs.writeFileSync(`${fullpath}/mda.json`, fileDataMda, 'utf8');

      //write etl.json
      const createArr = [];
      const distributeArr = [];
      const tasksArr = [];

      const sqlEtl = 'SELECT asset_id, category, type, file, file_content, db, active, task_order '
    + 'FROM bedrock.etl_tasks WHERE asset_id = $1 ORDER BY category, task_order';
      const etlData = await client.query(sqlEtl, [asset.id]);
      if (etlData.rows[0]) {
        for (let k = 0; k < etlData.rows.length; k += 1) { // (const row of etlData.rows) {
          const row = etlData.rows[k];
          const taskStr = '    {\n'
        + `      "type": "${row.type}",\n`
        + `      "file": "${row.file}",\n`
        + `${row.db ? `      "db": "${row.db}",\n` : ''}`
        + `      "active": ${row.active}\n`
        + '    }';

          if (row.category === 'create') { createArr.push(taskStr); } else if (row.category === 'distribute') { distributeArr.push(taskStr); } else if (row.category === 'tasks') { tasksArr.push(taskStr); }

          // write working files(fmw, sql)
          if (row.file && row.file_content) {
            const fileDataWorking = new Uint8Array(Buffer.from(row.file_content));
            fs.writeFileSync(`${fullpath}/${row.file}`, fileDataWorking, 'utf8');
          }
        }
        const etlStr = '{\n'
    + '  "create": ['
    + `${createArr.length > 0 ? `\n${createArr.join(',\n')}\n  ` : ''}`
    + '],\n'
    + '  "distribute": ['
    + `${distributeArr.length > 0 ? `\n${distributeArr.join(',\n')}\n  ` : ''}`
    + '],\n'
    + '  "tasks": ['
    + `${tasksArr.length > 0 ? `\n${tasksArr.join(',\n')}\n  ` : ''}`
    + ']\n'
    + '}\n';
        const fileDataEtl = new Uint8Array(Buffer.from(etlStr));
        fs.writeFileSync(`${fullpath}/etl.json`, fileDataEtl, 'utf8');
        // console.log("File etl.json written: ", asset.name);
        // console.log("File etl.json written: ", asset.name);
        // console.log("File etl.json written: ", asset.name);
      }
    }

    // Now let's download any blueprints that are referenced

    const bdir = `${startDir}/blueprints`;
    if (!fs.existsSync(bdir)) fs.mkdirSync(bdir);

    const blueprints = Object.keys(blueprintMap);
    for (let j = 0; j < blueprints.length; j += 1) {
      const sql = `SELECT b.name, b.description, b.update_date, c.blueprint_name, 
        c.column_name, c.ordinal_position, c.is_nullable, c.data_type, c.character_maximum_length,
        c.numeric_precision, c.numeric_precision_radix, c.numeric_scale, c.datetime_precision,
        c.interval_type, c.interval_precision FROM bedrock.object_blueprints b LEFT OUTER JOIN
        bedrock.object_blueprint_columns c ON b.name = c.blueprint_name
        WHERE b.name = $1`;
        /* eslint-disable no-loop-func, spaced-comment */

      const bp = await client.query(sql, [blueprints[j]]);

      if (bp.rows && bp.rows.length > 0) {
        const bpColString = bp.rows.reduce((accum, row, idx) => {
          const item = `    {
        "column_name": "${row.column_name}",
        "data_type": "${row.data_type}",
        "ordinal_position": "${row.ordinal_position}",
        "is_nullable": "${row.is_nullable}",
        "character_maximum_length": "${row.character_maximum_length}",
        "numeric_precision": "${row.numeric_precision}",
        "numeric_precision_radix": "${row.numeric_precision_radix}",
        "numeric_scale": "${row.numeric_scale}",
        "datetime_precision": "${row.datetime_precision}",
        "interval_type": "${row.interval_type}",
        "interval_precision": "${row.interval_precision}"
      }${(idx === bp.rows.length - 1) ? '\n' : ',\n'}`;
          return accum + item;
        }, '');


        const bpStr = `{
         "name": "${bp.rows[0].blueprint_name}",
         "description": "${bp.rows[0].description}",
         "update_date": "${bp.rows[0].update_date}",
         "columns": [
           ${bpColString}
         ]
        }`;

        const fileDataBp = new Uint8Array(Buffer.from(bpStr));
        fs.writeFileSync(`${bdir}/${bp.rows[0].name}.json`, fileDataBp, 'utf8');
      }
    }
  }
}

function arrToStr(arr) {
  return arr
    ? '['
  + `${arr[0] === '' ? '' : `\n    "${arr.join('",\n    "')}"\n  `}`
  + ']'
    : '[]';
}

function dateToStr(dt) {
  return dt
    ? dt.toISOString()
    : '';
}

module.exports = checkout;
