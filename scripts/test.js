const checkout = require('./checkout');

async function Run(){
    let result = await checkout().catch(e => console.error("Caught: " + e));
    console.log(result);

}
Run();