const connections = {
  warehouse1: {
    type: 'pg',
    authMethod: 'password',
    host: process.env.db1host,
    database: process.env.db1database,
    user: process.env.db1user,
    password: process.env.db1password,
  },

  accela: {
    type: 'sqlserver',
    authMethod: 'ad',
    host: process.env.accelahost,
    database: process.env.acceladatabase,
  },
};
export default connections;
