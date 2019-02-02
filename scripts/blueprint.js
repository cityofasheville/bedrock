/* eslint-disable no-console, spaced-comment, no-await-in-loop */
const fs = require('fs');
const connectionManager = require('./db/connection_manager');

async function blueprint(args) {

  if (args.argCount() < 2) {
    console.log('Usage: blueprint [snapshot|install|checkout] [assetName|blueprintName]');
    return;
  }
  const command = args.popArg();
  const name = args.popArg();

  if (command === 'snapshot') {
    const path = `${args.getOption('start', '.')}/${name}`;
    console.log(`The path: ${path}`);
    if (fs.existsSync(path)) {
      const mdafd = fs.openSync(`${path}/mda.json`, 'r');
      const mda = JSON.parse(fs.readFileSync(mdafd, { encoding: 'utf8' }));
      fs.closeSync(mdafd);
      if (mda.objects && mda.objects.length > 0) {
        for (let j = 0; j < mda.objects.length; j += 1) {
          const obj = mda.objects[j];
          console.log(obj.name);
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
    const path = `${args.getOption('start', '.')}/blueprints/${name}.json`;
    if (!fs.existsSync(path)) {
      console.log(`No blueprint found at ${path}`);
      return;
    }
    const bedrockClient = connectionManager.getConnection('bedrock');
    const bpfd = fs.openSync(path, 'r');
    const bp = JSON.parse(fs.readFileSync(bpfd, { encoding: 'utf8' }));
    fs.closeSync(bpfd);
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
  } else if (command === 'checkout') {
    const path = `${args.getOption('start', '.')}/blueprints/${name}.json`;
    const bedrockClient = connectionManager.getConnection('bedrock');
    const bp = { columns: [] };

    const sqlQuery = `SELECT name, description, update_date FROM bedrock.object_blueprints WHERE name = '${name}'`;
    const bpResult = await bedrockClient.query(sqlQuery)
      .then(res => {
        if (res.rowCount !== 1) {
          console.log(`Unable to find blueprint ${name}`);
          return Promise.resolve(null);
        }
        bp.name = res.rows[0].name;
        bp.description = res.rows[0].description;
        bp.update_date = res.rows[0].update_date;
        return bedrockClient.query(`SELECT * from bedrock.object_blueprint_columns WHERE blueprint_name = '${bp.name}'`);
      })
      .then(res => {
        if (res === null) return Promise.resolve(null);
        if (res.rows.length > 0) {
          bp.columns = res.rows.map(row => {
            return {
              column_name: row.column_name,
              ordinal_position: row.ordinal_position,
              is_nullable: row.is_nullable,
              data_type: row.data_type,
              character_maximum_length: row.character_maximum_length,
              numeric_precision: row.numeric_precision,
              numeric_precision_radix: row.numeric_precision_radix,
              numeric_scale: row.numeric_scale,
              datetime_precision: row.datetime_precision,
              interval_type: row.interval_type,
              interval_precision: row.interval_precision,
            };
          });
        }
        return Promise.resolve(bp);
      });
    if (bpResult) {
      const bpfd = fs.openSync(path, 'w');
      fs.writeFileSync(bpfd,
        `
{
  "name": "${bp.name}",
  "description": "${bp.description}",
  "update_date": "${bp.update_date}",
  "columns": ${JSON.stringify(bp.columns, null, 2)}
}
`, { encoding: 'utf8' });
      fs.closeSync(bpfd);
    }
  } else {
    console.log(`Unknown blueprint command ${command}`);
  }
}

module.exports = blueprint;
