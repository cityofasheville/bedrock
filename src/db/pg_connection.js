const Pool = require('pg-pool');
function connection(ci) {
  let c = null;
  if (ci.authMethod === 'password') {
    c = new Pool({
      host: ci.host,
      user: ci.user,
      password: ci.password,
      database: ci.database,
      max: 10,
      idleTimeoutMillis: 10000,
      //  ssl: true,
    });
  } else {
    throw new Error(`${this.connectionInfo.authMethod} authMethod not supported`);
  }
  return c;
}

exports.default = connection;
