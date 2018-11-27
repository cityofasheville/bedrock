#!/usr/bin/env node

var bedrock = require('../index.js');

var args = process.argv.splice(process.execArgv.length + 2);

var param = args[0];

if(param==='-v'){
    console.log(bedrock.version());
}else{
    console.log("bedrock rocks the house");
}