const fs = require('fs');
const toposort = require('toposort');

function readEtlConfig(path, logger) {
  let etlConfig = null;
  try {
    const files = fs.readdirSync(path);
    const defIndex = files.indexOf('etl.json');
    if (defIndex >= 0) {
      const fd = fs.openSync(`${path}/etl.json`, 'r');
      etlConfig = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
    }
  } catch (err) {
    logger.error({ err }, `Error reading ${path}/etl.json`);
  }
  return etlConfig;
}

let graph = {};

function createNode(config) {
  let job = null;
  if (config.type) {
    job = Object.assign({}, config); // Just copy everything in & let the job runner sort it
  }
  const node = { name: config.name, job };
  return node;
}

function addNode(node) {
  if (!(node.name in graph.nodes)) graph.nodes[node.name] = [node];
  else graph.nodes[node.name].push(node);
}

function createEdge(name1, name2) {
  return [name1, name2];
}

function addToGraph(config) {
  if (config) {
    config.jobs.forEach((job) => {
      addNode(createNode(job));
      // Add common dependencies
      config.depends.forEach((name) => {graph.edges.push(createEdge(job.name, name));});
      // Add dependencies for just this job
      job.depends.forEach((name) => {graph.edges.push(createEdge(job.name, name));});
    });
  }
}

function process(stage, path, dest, config, logger) {
  let fd;
  switch (stage) {
    case 'init':
      graph = { nodes: {}, edges: [] };
      break;
    case 'run':
      addToGraph(readEtlConfig(path, logger));
      break;
    case 'finish':
      graph.edges = toposort(graph.edges).reverse();
      fd = fs.openSync('./output.json', 'w');
      fs.writeFileSync(fd, JSON.stringify(graph), { encoding: 'utf8' });
      break;
    default:
      break;
  }
}

module.exports = process;
