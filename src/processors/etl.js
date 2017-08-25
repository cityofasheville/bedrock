const fs = require('fs');
const pathModule = require('path');
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

function createNode(name, tasks, path, commonDepends) {
  let job = null;
  job = { depends: commonDepends, tasks };
  const node = { name, path, job };
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

function addToGraph(config, mainConfig, path, logger) {
  if (config) {
    addNode(createNode(mainConfig.mda.name, config.tasks, path, config.depends), logger);
    // Add dependencies
    config.depends.forEach(name => { graph.edges.push(createEdge(mainConfig.mda.name, name)); });
  }
}

// This generates a JSON file with two sets of jobs.
// In the sequenced set any dependencies of a job are guaranteed to be listed
// before it. The freeJobs array contains jobs with no dependencies.

function process(stage, path, dest, mainConfig, logger) {
  let fd;
  let result;
  let d;
  let resolvedPath;
  switch (stage) {
    case 'init':
      graph = { nodes: {}, edges: [] };
      break;

    case 'run':
      resolvedPath = pathModule.resolve(path);
      addToGraph(readEtlConfig(path, logger), mainConfig, resolvedPath, logger);
      break;

    case 'finish':
      result = { sequencedJobs: [], freeJobs: [] };
      toposort(graph.edges).reverse().forEach(jobName => {
        result.sequencedJobs.push(graph.nodes[jobName]);
        delete graph.nodes[jobName];
      });
      // Remaining nodes have no dependencies, nor nodes that depend on them.
      Object.keys(graph.nodes).forEach(jName => {
        result.freeJobs.push(graph.nodes[jName]);
      });
      fd = fs.openSync(`${dest}/etl_jobs.json`, 'w');
      fs.writeFileSync(fd, JSON.stringify(result), { encoding: 'utf8' });
      fs.closeSync(fd);
      d = Date.now();
      fd = fs.openSync(`${dest}/etl_jobs_date.json`, 'w');
      fs.writeFileSync(fd, JSON.stringify({ dateValue: d, dateString: new Date(d).toISOString() }));
      fs.closeSync(fd);
      break;

    default:
      break;
  }
}

module.exports = process;
