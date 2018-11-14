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
};
var pool = new Pool(dbConfig);
pool.connect().then(client => {
    const sqlAsset = 'SELECT ass.id, ass.name, ass.path, loc.short_name AS location, ' +
    'ass.active, ass.type, ass.description ' +
    'FROM bedrock.assets ass ' +
    'INNER JOIN bedrock.asset_locations loc ' +
    'ON ass.location = loc.id ' +
    'where ass.id = 4258;';
    client.query( sqlAsset ).then(assets => {
        if(!assets.rows[0]){
            console.log('no data');
            cleanUp(client);
        }else{ 
            assets.rows.forEach(asset=>{ console.log(asset.id);
                let dependList = '[';
                const sqlDepends = 'SELECT depends FROM bedrock.asset_depends where asset_id = $1';
                client.query( sqlDepends, [ asset.id ]).then(depends => {
                    depends.rows.forEach(depend => {
                        dependList = dependList + '\n       "' + depend.depends + '"'
                    })
                    dependList = dependList + '\n   ]';
                    const fullpath = startDir + '/' + asset.path;
                    // console.log(asset);
                    fs.mkdirSync(fullpath, { recursive: true });
                    const mdaData = 
`{
    "name": "${asset.name}",
    "location": "${asset.location}",
    "active": "${asset.active}",
    "type": "${asset.type}",
    "description": "${asset.description}",
    "depends": ${dependList}
}`;
                    const fileData = new Uint8Array(Buffer.from(mdaData));
                    fs.writeFileSync(fullpath + '/mda.json', fileData, 'utf8');
                    cleanUp(client);
                });
            })

        }
    })
    .catch(e => {console.error('query error', e.message, e.stack); cleanUp(client)});
});


function cleanUp(client){
    client.release();
    process.exit(0);
}