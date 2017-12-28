const fs = require('fs');
const Pool = require('pg-pool');

let localPool = null;

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

//
// Set up DB connection
//
function init() {
  const dbConfig = {
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    database: process.env.database,
    max: 10,
    idleTimeoutMillis: 10000,
  //  ssl: true,
  };

  if (localPool == null) {
    localPool = new Pool(dbConfig);
  }
}

function finish() {
  localPool.end();
}

function validate(columns, mda, tableInfo, path, logger) {
  //
  // We validate against expected columns based on mda.columns_specification.type.
  //    explicit:  columns_specification.columns contains explicit definitions
  //               of all columns
  //    derived:   columns_specification.file points to a file with explicit
  //               definitions snapshotted there from the actual DB table
  //

  // Create a hash to track what's been checked
  const checkColumns = {};
  Object.getOwnPropertyNames(columns).forEach((colName) => {
    checkColumns[colName] = false;
  });

  let expectedColumns = null;
  if (mda.columns_specification.type === 'explicit') {
    expectedColumns = mda.columns_specification.columns;
  } else if (mda.columns_specification.type === 'derived') {
    const fd = fs.openSync(`${path}/${mda.columns_specification.filename}`, 'r');
    expectedColumns = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
  }
  expectedColumns.forEach((cDef) => {
    console.log(`Doing column ${cDef.column}`);
    if (!(cDef.column in columns)) { // Missing column.
      logger.error('table-missing-column',
      `Required column ${cDef.column} not found in table ${tableInfo.table}`,
      { table: tableInfo.table, column: cDef.column });
    } else {
      checkColumns[cDef.column] = true;
      const typeErr = verifyType(cDef, columns[cDef.column]);
      if (typeErr) { // Type mis-match.
        logger.error('column-type-err',
          `Types error in column ${cDef.column} of table ${tableInfo.table}: ${typeErr}`,
          { table: tableInfo.table, column: cDef.column, message: typeErr });
      }
    }
  });

  // Now make sure every table column is accounted for in the definition
  Object.getOwnPropertyNames(checkColumns).forEach((colName) => {
    if (!checkColumns[colName]) {
      logger.error('definition-missing-column',
        `Column ${colName}, table ${tableInfo.table} is missing from definition`,
        { table: tableInfo.table, column: colName });
    }
  });
}

function run(pool, path, config, logger) {
  const fd = fs.openSync(`${path}/mda.json`, 'r');
  const ddef = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
  console.log(`Running validation in ${path}`);
  ddef.datasets.forEach((ds) => {
    const target = ds.target;
    if (target) {
      const cn = config.connectionManager.getConnection(target.connection);
      cn.tableInfo(cn.getDatabase(), target.schema, target.table)
        .then((columns) => {
          if (columns && ds.columns_specification.type !== 'none') {
            validate(columns, ds, target, path, logger);
          } else {
            logger.error('missing-table',
              `Target table ${target.table} does not exist or contains no columns`,
              {
                connection: cn.getConnectionName(),
                schema: target.schema,
                table: target.table,
              });
          }
        });
    }

    const source = ds.source;
    if (source) {
      console.log(`WE ARE TESTING AGAINST THE SOURCE TABLE = ${JSON.stringify(source)}`);
      const cn = config.connectionManager.getConnection(source.connection);
      cn.tableInfo(cn.getDatabase(), source.schema, source.table)
        .then((columns) => {
          if (columns && ds.columns_specification.type !== 'none') {
            validate(columns, ds, source, path, logger);
          } else {
            logger.error('missing-table',
              `Source table ${source.table} does not exist or contains no columns`,
              {
                connection: cn.getConnectionName(),
                schema: source.schema,
                table: source.table,
              });
          }
        })
        .catch((err) => {
          console.log(`Source: We got an exception with err = ${JSON.stringify(err)}`);
        });
    }

  });
}

function processing(stage, path, dest, config, logger) {
  const pool = localPool;
  switch (stage) {
    case 'init':
      init();
      break;
    case 'run':
      run(pool, path, config, logger);
      break;
    case 'finish':
      finish();
      break;
    default:
      break;
  }
}
module.exports = processing;
