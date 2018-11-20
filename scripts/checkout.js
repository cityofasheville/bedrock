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

 async function checkout(){
    let pool = new Pool(dbConfig);
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
            //create dir
            const fullpath = startDir + '/' + asset.path;
            fullpath.split('/')
            .reduce((currentPath, folder) => {
                currentPath += folder + '/';
                if (!fs.existsSync(currentPath)){
                    fs.mkdirSync(currentPath);
                }
                return currentPath;
            }, '');
            
            //write mda.json
            let dependArray = [];
            const sqlDepends = 'SELECT depends FROM bedrock.asset_depends where asset_id = $1';
            let depends = await client.query( sqlDepends, [ asset.id ]);
            for( let depend of depends.rows){
                dependArray.push('\n    "' + depend.depends + '"');
            };
            let dependList = dependArray.length>0 ? '[' + dependArray.join(',') + '\n  ]' : '[]';

            const sqlAssetFile = 'SELECT type, file, file_content FROM bedrock.asset_files where asset_id = $1';
            let AssetFile = await client.query( sqlAssetFile, [ asset.id ]);

            let FileObj = AssetFile.rows[0] ? AssetFile.rows[0] : {};

            const mdaStr = 
            `{\n`+
            `  "name": "${asset.name}",\n`+
            `  "location": "${asset.location}",\n`+
            `  "active": ${asset.active},\n`+
            `  "type": "${asset.type}",\n`+
            `  "description": "${asset.description}",\n`+
            `  "depends": ${dependList}`+
            `${FileObj.file ? ',\n  "schema": {\n    "type": "' + FileObj.type + '",\n    "file": "' + FileObj.file + '"\n  }' : ''}` +
            `\n}`;
            const fileDataMda = new Uint8Array(Buffer.from(mdaStr));
            fs.writeFileSync(fullpath + '/mda.json', fileDataMda, 'utf8');

            // write asset files(asset creation sqls)
            if(FileObj.file && FileObj.file_content){
                const fileDataWorking = new Uint8Array(Buffer.from(FileObj.file_content));
                fs.writeFileSync(fullpath + '/' + FileObj.file, fileDataWorking, 'utf8');
            }

            //write etl.json
            let createArr = [];
            let distributeArr = [];
            let tasksArr = [];
            
            const sqlEtl = 'SELECT asset_id, category, type, file, file_content, db, active, task_order ' +
            'FROM bedrock.etl_tasks WHERE asset_id = $1 ORDER BY category, task_order'
            let etlData = await client.query( sqlEtl, [ asset.id ]);
            if(etlData.rows[0]){
                for( let row of etlData.rows){
                    let db = row.db ? `      "db": "${row.db}",\n` : ``;
                    const taskStr = 
                    `    {\n`+
                    `      "type": "${row.type}",\n`+
                    `      "file": "${row.file}",\n`+
                    `${row.db ? '      "db": "'+row.db+'",\n' : ''}` +
                    `      "active": ${row.active}\n`+
                    `    }`;

                    if(row.category==="create"){createArr.push(taskStr);}
                    else if(row.category==="distribute"){distributeArr.push(taskStr);}
                    else if(row.category==="tasks"){tasksArr.push(taskStr);}

                    // write working files(fmw, sql)
                    if(row.file && row.file_content){
                        const fileDataWorking = new Uint8Array(Buffer.from(row.file_content));
                        fs.writeFileSync(fullpath + '/' + row.file, fileDataWorking, 'utf8');
                    }
                };
                const etlStr = 
                `{\n`+
                `  "create": [`+
                `${createArr.length>0?'\n'+createArr.join(',\n')+'\n  ':''}`+
                `],\n`+
                `  "distribute": [`+
                `${distributeArr.length>0?'\n'+distributeArr.join(',\n')+'\n  ':''}`+
                `],\n`+
                `  "tasks": [`+
                `${tasksArr.length>0?'\n'+tasksArr.join(',\n')+'\n  ':''}`+
                `]\n`+
                `}\n`;
                const fileDataEtl = new Uint8Array(Buffer.from(etlStr));
                fs.writeFileSync(fullpath + '/etl.json', fileDataEtl, 'utf8');
                // console.log("File etl.json written: ", asset.name);  
            }     
        };
        cleanUp(client);
    };
}
checkout().catch(e => {console.error('query error', e.message, e.stack); cleanUp(client)});

function cleanUp(client){
    client.release();
    process.exit(0);
}

module.exports = checkout;
