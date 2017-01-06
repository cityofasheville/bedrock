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

function createNode(config, commonDepends) {
  let job = null;
  if (config.type) {
    job = Object.assign({}, config); // Just copy everything in & let the job runner sort it
    job.depends = job.depends.concat(commonDepends);
  }
  const node = { name: config.name, job };
  return node;
}

function addNode(node, logger) {
  if (!(node.name in graph.nodes)) graph.nodes[node.name] = node;
  else {
    logger.error(`Duplicate job name ${node.name}`);
  }
}

function createEdge(name1, name2) {
  return [name1, name2];
}

function addToGraph(config, logger) {
  if (config) {
    config.jobs.forEach((job) => {
      addNode(createNode(job, config.depends), logger);
      // Add common dependencies
      config.depends.forEach((name) => { graph.edges.push(createEdge(job.name, name)); });
      // Add dependencies for just this job
      job.depends.forEach((name) => { graph.edges.push(createEdge(job.name, name)); });
    });
  }
}

// This generates a JSON file with two sets of jobs.
// In the sequenced set any dependencies of a job are guaranteed to be listed
// before it. The freeJobs array contains jobs with no dependencies.

function process(stage, path, dest, config, logger) {
  let fd;
  let result;
  switch (stage) {
    case 'init':
      graph = { nodes: {}, edges: [] };
      break;

    case 'run':
      addToGraph(readEtlConfig(path, logger), logger);
      break;

    case 'finish':
      result = { sequencedJobs: [], freeJobs: [] };
      toposort(graph.edges).reverse().forEach((jobName) => {
        result.sequencedJobs.push(graph.nodes[jobName]);
        delete graph.nodes[jobName];
      });
      // Remaining nodes have no dependencies
      Object.keys(graph.nodes).forEach((jName) => { result.freeJobs.push(graph.nodes[jName]); });
      fd = fs.openSync(`${dest}/etl_jobs.json`, 'w');
      fs.writeFileSync(fd, JSON.stringify(result), { encoding: 'utf8' });
      break;

    default:
      break;
  }
}

module.exports = process;
