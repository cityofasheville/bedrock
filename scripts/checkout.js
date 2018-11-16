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

(async function Run(){
    var pool = new Pool(dbConfig);
    let client = await pool.connect();
    const sqlAsset = 'SELECT ass.id, ass.name, ass.path, loc.short_name AS location, ' +
    'ass.active, ass.type, ass.description ' +
    'FROM bedrock.assets ass ' +
    'INNER JOIN bedrock.asset_locations loc ' +
    'ON ass.location = loc.id ' ;
    let assets = await client.query( sqlAsset );
    if(!assets.rows[0]){
        console.log('No data');
        cleanUp(client);
    }else{ 
        for(let asset of assets.rows){
            let dependArray = [];
            const sqlDepends = 'SELECT depends FROM bedrock.asset_depends where asset_id = $1';
            var depends = await client.query( sqlDepends, [ asset.id ]);
            for( let depend of depends.rows){
                dependArray.push('\n    "' + depend.depends + '"');
            };
            dependList = '[' + dependArray.join(',') + '\n  ]';

            const fullpath = startDir + '/' + asset.path;
            fullpath.split('/')
            .reduce((currentPath, folder) => {
                currentPath += folder + '/';
                if (!fs.existsSync(currentPath)){
                    fs.mkdirSync(currentPath);
                }
                return currentPath;
            }, '');
            
            const mdaData = 
            `{\n`+
            `  "name": "${asset.name}",\n`+
            `  "location": "${asset.location}",\n`+
            `  "active": "${asset.active}",\n`+
            `  "type": "${asset.type}",\n`+
            `  "description": "${asset.description}",\n`+
            `  "depends": ${dependList}\n`+
            `}\n`;
            const fileData = new Uint8Array(Buffer.from(mdaData));
            fs.writeFileSync(fullpath + '/mda.json', fileData, 'utf8');
            console.log("File mda.json written: ", asset.name);
        };
        cleanUp(client);
    };
})().catch(e => {console.error('query error', e.message, e.stack); cleanUp(client)});

function cleanUp(client){
    client.release();
    process.exit(0);
}