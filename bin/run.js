const toposort = require('toposort');
const prettyJson = require('../scripts/common/pretty_json');


const checkout_data = require('./checkout_data');

(async run => {
  const data = await checkout_data();
  console.log((data));
  console.log((data.mda));
  graph = { nodes: {}, edges: [] };

})();
