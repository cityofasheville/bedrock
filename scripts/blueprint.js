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
                  is_nullable: col.is_nullable === 'YES',
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
  }
}

module.exports = blueprint;
