/* eslint-disable no-console */
const fs = require('fs');
const connectionManager = require('./db/connection_manager');

async function createObjects(args) {
  if (args.argCount() < 1) {
    console.log(`argcount is ${args.argCount()}`);
    process.exit(1);
  }
  const assetName = args.getArg(0);
  const startDir = args.getOption('start', '.');
  const path = `${startDir}/${assetName}/mda.json`;

  if (!fs.existsSync(path)) {
    console.error(`Asset ${assetName} not found`);
    process.exit(1);
  }
  const mdafd = fs.openSync(`${path}`, 'r');
  const mda = JSON.parse(fs.readFileSync(mdafd, { encoding: 'utf8' }));
  if (!mda.objects || mda.objects.length === 0) {
    console.log(`No objects found for asset ${assetName}`);
    process.exit(1);
  }
  const tClient = connectionManager.getConnection('mdastore1');

  console.log(`Create the objects for ${assetName}`);
  for (let i = 0; i < mda.objects.length; i += 1) {
    const obj = mda.objects[i];
    console.log(`Do object ${JSON.stringify(obj, null, 2)}`);
    if (obj.type === 'table') {
      const objName = `${obj.schema}.${obj.name}`;
      const existsQuery = `SELECT EXISTS (
        SELECT * FROM information_schema.tables
        WHERE table_schema = '${obj.schema}' AND table_name = '${obj.name}'
        )`;
      if (obj.blueprint) {
        const result = await tClient.query(existsQuery);
        if (!result.rows || result.rows.length <= 0) {
          throw new Error(`Error querying whether table ${objName} exists`);
        }
        if (result.rows[0].exists) {
          console.log(`Table ${objName} already exists - aborting`);
          process.exit(0);
        }
        console.log('Ready to create');
        let createQuery = `create table ${objName} (\n`;
        const bClient = connectionManager.getConnection('bedrock');
        const blueprintQuery = `SELECT * FROM bedrock.object_blueprint_columns
          WHERE blueprint_name = '${obj.blueprint}'`;
        const colResult = await bClient.query(blueprintQuery);
        if (!result.rows || result.rows.length <= 0) {
          throw new Error(`Error querying columns for blueprint ${obj.blueprint}`);
        }
        const columns = colResult.rows;
        const ncolumns = columns.length;
        columns.forEach((col, idx) => {
          const columnDef = columnDefinition(col);
          createQuery += columnDef + ((idx < ncolumns - 1) ? ',\n' : '\n');
        });
        createQuery += ') WITH ( OIDS = FALSE ) TABLESPACE pg_default;';
        console.log('Got the base query done');
        const auxQuery = `SELECT * from bedrock.object_blueprint_aux_info where blueprint_name = '${obj.blueprint}'`;
        const auxResult = await bClient.query(auxQuery);
        const aux = auxResult.rows.map(row => {
          return {
            name: row.name,
            description: row.description,
            type: row.type,
            value: JSON.parse(row.value),
          };
        });
        const indices = [];
        if (aux.length > 0) {
          aux.forEach(itm => {
            if (itm.type === 'index') {
              indices.push(itm);
            }
          });
        }
        console.log(JSON.stringify(indices, null, 2));
        indices.forEach(index => {
          createQuery += indexDefinition(index, obj);
        });
        console.log(createQuery);
        tClient.query(createQuery)
          .then(res => {
            console.log(JSON.stringify(res));
          });
      } else {
        console.log(`No blueprint specified for object ${objName}`);
      }
    }
  }
}

function columnDefinition(col) {
  let colType = col.data_type;
  const nullClause = col.is_nullable === 'NO' ? ' NOT NULL' : '';
  switch (col.data_type) {
    case 'numeric':
      colType = `numeric(${col.numeric_precision},${col.numeric_scale})`;
      break;
    case 'character varying':
      colType = `character varying(${col.character_maximum_length})`;
      break;
    case 'geometry':
      colType = 'geometry(Geometry,2264)';
      break;
    default:
      break;
  }
  const def = `${col.column_name} ${colType} ${nullClause}`;
  return def;
}

function indexDefinition(index, obj) {
  const nm = `${index.name}_${obj.name}`;
  const cols = index.value.columns.reduce((accum, cur, idx) => {
    const end = (idx < index.value.columns.length - 1) ? ',' : ')';
    return `${accum} ${cur}${end}`;
  }, '(');
  const q = `CREATE INDEX ${nm} ON ${obj.schema}.${obj.name} USING ${index.value.using} ${cols};`;
  console.log(q);
  return q;
}
module.exports = createObjects;
