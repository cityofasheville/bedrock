const fs = require('fs');
const checkout = require('./checkout');


checkout().then(()=>{
    if(fs.existsSync('C:/jon/bedrock/working_directory/assets/it/workorders/mda.json')){
    console.log('file exists');
    }
}).catch(e => console.error("Caught: " + e));
    
