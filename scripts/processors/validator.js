const fs = require('fs');
const pgMetadata = require('pg-metadata');

function verifyType(def, actual) {
  let error = null;
  switch (actual.type) {
    case 'varchar':
      if (def.type !== `varchar(${actual.length})`) {
        error = `Bad type ${actual.type}(${actual.length}) vs ${def.type}`;
      }
      break;
    case 'int4':
      if (def.type !== 'integer') {
        error = `Bad type ${actual.type} - should be ${def.type}`;
      }
      break;
    case 'int8':
      if (def.type !== 'bigint') {
        error = `Bad type ${actual.type} - should be ${def.type}`;
      }
      break;
    case 'numeric':
      if (def.type !== `numeric(${actual.precision},${actual.scale})`) {
        error = `Numeric(${actual.precision},${actual.scale}), should be ${def.type}`;
      }
      break;
    case 'timestamp':
      if (def.type !== 'timestamp-no-tz') {
        error = `Type is timestamp, should be ${def.type}`;
      }
      break;
    default:
      // Default catches text, geometry
      if (def.type !== actual.type) {
        error = `Unknown type: ${actual.type}, length ${actual.length} - should be ${def.type}`;
      }
      break;
  }
  return error;
}

function doValidation(pool, path, config, logger) {
  return pool.connect((err, client, release) => {
    if (err) {
      logger.error({ err }, 'Unable to connect');
      return;
    }
    const fd = fs.openSync(`${path}/dataset.json`, 'r');
    const ddef = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));

    pgMetadata(client, { table: ddef.table }, (qerr, metadata) => {
      if (qerr) {
        release();
        logger.error({ err: qerr }, 'Error reading metadata');
      }
      release();
      const columns = metadata[config.db][ddef.schema][ddef.table];
      const checkColumns = {};
      Object.getOwnPropertyNames(columns).forEach(colName => {
        checkColumns[colName] = false;
      });

      ddef.columns.forEach((cDef) => {
        if (!(cDef.column in columns)) {
          logger.error(`Required column ${cDef.column} not found in table ${ddef.table}`);
        } else {
          checkColumns[cDef.column] = true;
          const typeErr = verifyType(cDef, columns[cDef.column]);
          if (typeErr) {
            logger.error(`Type error in column ${cDef.column} of table ${ddef.table}: ${typeErr}`);
          }
        }
      });

      Object.getOwnPropertyNames(checkColumns).forEach(colName => {
        if (!checkColumns[colName]) {
          logger.error(`Column ${colName}, table ${ddef.table} is missing from definition`);
        }
      });
      return metadata;
    });
  });
}

const validate = function validate(path, dest, config, logger) {
  const pool = config.pool;
  return doValidation(pool, path, config, logger);
};


function process(stage, path, dest, config, logger) {
  const pool = config.pool;
  switch (stage) {
    case 'init':
      // Nothing
      break;
    case 'run':
      doValidation(pool, path, config, logger);
      break;
    case 'finish':
      // Nothing
      break;
    default:
      break;
  }
}
module.exports = process;
