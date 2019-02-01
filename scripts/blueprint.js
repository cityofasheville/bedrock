/* eslint-disable no-console, spaced-comment, no-await-in-loop */
const fs = require('fs');
const connectionManager = require('./db/connection_manager');

async function blueprint(args) {
  console.log('In blueprint');
  if (args.argCount() < 2) {
    console.log('Usage: blueprint command assetName');
    return;
  }
  const command = args.popArg();
  const assetName = args.popArg();

  if (command === 'snapshot') {
    const path = `${args.getOption('start', '.')}/${assetName}`;
    console.log(`The path: ${path}`);
    if (fs.existsSync(path)) {
      const mdafd = fs.openSync(`${path}/mda.json`, 'r');
      const mda = JSON.parse(fs.readFileSync(mdafd, { encoding: 'utf8' }));
      if (mda.objects && mda.objects.length > 0) {
        for (let j = 0; j < mda.objects.length; j += 1) {
          const obj = mda.objects[j];
          console.log(obj.name);
          const bedrockClient = connectionManager.getConnection('bedrock');
          const dbClient = connectionManager.getConnection(mda.location);
          if (dbClient === null) throw new Error(`Unknown database ${mda.location}`);
          const sql = `SELECT * from information_schema.columns WHERE table_schema = '${obj.schema}' AND table_name = '${obj.name}'`;
          await dbClient.query(sql)
            .then(res => {
              const bpfd = fs.openSync(`${path}/${obj.name}.blueprint.json`, 'w');
              const bp = {
                name: obj.name,
                description: 'TBD',
                update_date: null,
                columns: [],
              };
              bp.columns = res.rows.map(col => {
                let dataType = col.data_type;
                if (dataType === 'USER DEFINED' && col.udt_name === 'geometry') dataType = 'geometry';
                return {
                  column_name: col.column_name,
                  ordinal_position: col.ordinal_position,
                  is_nullable: col.is_nullable,
                  data_type: dataType,
                  character_maximum_length: col.character_maximum_length,
                  numeric_precision: col.numeric_precision,
                  numeric_precision_radix: col.numeric_precision_radix,
                  numeric_scale: col.numeric_scale,
                  datetime_precision: col.datetime_precision,
                  interval_type: col.interval_type,
                  interval_precision: col.interval_precision,
                };
              });
              fs.writeFileSync(bpfd, JSON.stringify(bp, null, 2), { encoding: 'utf8' });
              fs.closeSync(bpfd);
            });
        }
      }
    } else {
      console.log(`No mda.json file found at ${path}`);
    }
  } else if (command === 'install') {
    const path = `${args.getOption('start', '.')}/${assetName}`;
    if (fs.existsSync(path)) {
      const mdafd = fs.openSync(`${path}/mda.json`, 'r');
      const mda = JSON.parse(fs.readFileSync(mdafd, { encoding: 'utf8' }));
      if (mda.objects && mda.objects.length > 0) {
        for (let j = 0; j < mda.objects.length; j += 1) {
          const obj = mda.objects[j];
          console.log(`Installing ${obj.name}`);
          const bedrockClient = connectionManager.getConnection('bedrock');
          if (fs.existsSync(`${path}/${obj.name}.blueprint.json`)) {
            const bpfd = fs.openSync(`${path}/${obj.name}.blueprint.json`, 'r');
            const bp = JSON.parse(fs.readFileSync(bpfd, { encoding: 'utf8' }));
            const t1 = new Date();
            const currentDate = `${t1.getFullYear()}-${t1.getMonth() + 1}-${t1.getDate()}`;
            let sqlInsert = 'INSERT INTO bedrock.object_blueprints( '
            + ' name, description, update_date ) '
            + ' VALUES ($1, $2, $3)'
            + ' ON CONFLICT (name) DO UPDATE SET '
            + ' description = excluded.description, '
            + ' update_date = excluded.update_date;';
            await bedrockClient.query(sqlInsert, [bp.name, bp.description, currentDate])
              .then(res => {
                if (res.rowCount !== 1) throw new Error(`Error installing blueprint for ${obj.name}`);
                return bedrockClient.query(`DELETE from bedrock.object_blueprint_columns WHERE blueprint_name = '${bp.name}'`);
              });
            for (let k = 0; k < bp.columns.length; k += 1) {
              const col = bp.columns[k];
              sqlInsert = 'INSERT INTO bedrock.object_blueprint_columns( '
                + 'blueprint_name, column_name, ordinal_position, is_nullable, '
                + 'data_type, character_maximum_length, numeric_precision, numeric_precision_radix, '
                + 'numeric_scale, datetime_precision, interval_type, interval_precision'
                + ') '
                + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);';
              await bedrockClient.query(sqlInsert,
                [
                  bp.name, col.column_name, col.ordinal_position, col.is_nullable,
                  col.data_type, col.character_maximum_length, col.numeric_precision,
                  col.numeric_precision_radix, col.numeric_scale, col.datetime_precision,
                  col.interval_type, col.interval_precision,
                ]);
            }
          }
        }
      }
    } else {
      console.log(`No mda.json file found at ${path}`);
    }
  }
}

module.exports = blueprint;
