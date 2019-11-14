/* eslint-disable no-prototype-builtins */

const fs = require('fs');
const pathModule = require('path');
const toposort = require('toposort');
const checkout = require('../../checkout');

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
    logger.error(`Error reading ${path}/etl.json`, { err });
  }
  return etlConfig;
}

let graph = {};

function createNode(name, config, path, commonDepends) {
  let job = null;
  job = {
    depends: commonDepends,
    create: config.create,
    distribute: config.distribute,
    tasks: config.tasks,
  };
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
    addNode(createNode(mainConfig.mda.name, config, path, mainConfig.mda.depends), logger);
    // Add dependencies
    mainConfig.mda.depends.forEach(name => { graph.edges.push(createEdge(mainConfig.mda.name, name)); });
  }
}

// This generates a JSON file with two sets of jobs.
// In the sequenced set any dependencies of a job are guaranteed to be listed
// before it. The freeJobs array contains jobs with no dependencies.

async function process(stage, path, dest, mainConfig, logger) {
  let fd;
  let result;
  let d;
  let resolvedPath;
  switch (stage) {
    case 'init':
      // eslint-disable-next-line no-console
      await checkout().catch(e => { console.error(`checkout error: ${e}`); });
      graph = { nodes: {}, edges: [] };
      break;

    case 'run':
      resolvedPath = pathModule.resolve(path);
      addToGraph(readEtlConfig(path, logger), mainConfig, resolvedPath, logger);
      break;

    case 'finish':
      result = { sequencedJobs: [], freeJobs: [] };
      toposort(graph.edges).reverse().forEach(jobName => {
        if (!graph.nodes.hasOwnProperty(jobName)) {
          throw new Error(`No such job ${jobName}`);
        }
        result.sequencedJobs.push(graph.nodes[jobName]);
        delete graph.nodes[jobName];
      });
      // Remaining nodes have no dependencies, nor nodes that depend on them.
      Object.keys(graph.nodes).forEach(jName => {
        result.freeJobs.push(graph.nodes[jName]);
      });
      fd = fs.openSync(`${dest}/etl_jobs_definition.json`, 'w');
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
