const connections = {
  datastore1: {
    type: 'pg',
    authMethod: 'password',
    host: process.env.db1host,
    database: process.env.db1database,
    user: process.env.db1user,
    password: process.env.db1password,
  },
  datastoreX: {
    type: 'pg',
    authMethod: 'password',
    host: process.env.fauxhost,
    database: process.env.fauxdatabase,
    user: process.env.fauxuser,
    password: process.env.fauxpassword,
  },  
  warehouse1: {
    type: 'pg',
    authMethod: 'password',
    host: process.env.wh1host,
    database: process.env.wh1database,
    user: process.env.wh1user,
    password: process.env.wh1password,
  },
  edit1: {
    type: 'pg',
    authMethod: 'password',
    host: process.env.edithost,
    database: process.env.editdatabase,
    user: process.env.edituser,
    password: process.env.editpassword,
  },
  accela: {
    type: 'sqlserver',
    authMethod: 'ad',
    host: process.env.accelahost,
    database: process.env.acceladatabase,
  },
};
module.exports = connections;
