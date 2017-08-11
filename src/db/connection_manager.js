const Connection = require('./connection');

class ConnectionManager {
  constructor(config, logger) {
    this.connections = {};
    this.logger = logger;
    Object.getOwnPropertyNames(config).forEach((cname) => {
      console.log(`Connection manager initializing connection: ${cname}`);
      this.connections[cname] = {
        config: config[cname],
        connection: null,
      };
    });
  }

  getConnection(name) {
    let c = null;
    console.log(`In getConnection with name ${name}`);
    if (name in this.connections) {
      console.log('Got the connection');
      const connection = this.connections[name];
      c = connection.connection;
      if (!c) {
        console.log(`Initializing it with config ${JSON.stringify(connection.config)}`);
        c = connection.connection = new Connection(name, connection.config, this.logger);
      }
    } else {
      this.logger.error('unknown-db-connection', `Unknown database connection ${name}`, {});
    }
    return c;
  }
}

module.exports = ConnectionManager;
