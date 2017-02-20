const connectionDefinitions = require('../connection_definitions');

class Connection {
  constructor (cname, logger) {
    this.logger = logger;
    if (!(cname in connectionDefinitions)) {
      logger.error({ type: 'no-such-connection', connection: cname },
      `Unknown connection ${cname} in database initialization`);
      throw new Error(`Unknown connection ${cname}`);
    }
    this.connectionInfo = connectionDefinitions[cname];
    this.connection = null;
    if (this.connectionInfo.type == 'pg') {
      const pgConnection = require('./pg_connection');
      this.connection = pgConnection(this.connectionInfo);
    } else if (this.connectionInfo == 'ad') {
      
    }
  }

  // Get a client connection
  function connect(cname, logger) {

  }
}
export default Connection;
