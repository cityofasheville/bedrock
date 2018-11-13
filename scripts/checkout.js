/* eslint-disable no-console, spaced-comment */
require('dotenv').config();
const fs = require('fs');
const Pool = require('pg-pool');
const CommandLineArgs = require('./common/CommandLineArgs');

const args = new CommandLineArgs(process.argv.slice(2));
//if (args.argCount() < 1) usageAndExit();
const startDir = args.getOption('start', '.');

const dbConfig = {
    host: process.env.db1host,
    user: process.env.db1user,
    password: process.env.db1password,
    database: process.env.db1database,
    max: 10,
    idleTimeoutMillis: 10000,
  //  ssl: true,
};
var pool = new Pool(dbConfig)
pool.connect().then(client => {
    let sqllookup = 'SELECT id FROM bedrock.assets limit 1;';
    client.query(sqllookup, [asset.location]).then(res => {
    if(!res.rows[0]){
        console.error('no data');
        return;
    }else{
        res.rows.forEach(row=>{
            fs.mkdir(startDir + row.path, { recursive: true }, (err) => {
                if (err) throw err;
                console.log(startDir + row.path);
            });
        })

    }
    });
});
console.log('check out');
process.exit(0);

