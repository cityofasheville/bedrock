const Connection = require('./connection');
const connectionDefinitions = require('../db_connection_definitions');
const logger = require('../common/logger');

class ConnectionManager {
  constructor(config) {
    this.connections = {};
    this.logger = logger;
    Object.getOwnPropertyNames(config).forEach(cname => {
      this.connections[cname] = {
        config: config[cname],
        connection: null,
      };
    });
  }

  getConnection(name) {
    let c = null;
    if (name in this.connections) {
      const connection = this.connections[name];
      c = connection.connection;
      if (!c) {
        connection.connection = new Connection(name, connection.config, this.logger);
        c = new Connection(name, connection.config, this.logger);
      }
    } else {
      this.logger.error('unknown-db-connection', `Unknown database connection ${name}`, {});
    }
    return c;
  }
}

module.exports = new ConnectionManager(connectionDefinitions);
