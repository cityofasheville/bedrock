/* eslint-disable no-console */
const fs = require('fs');
const pathModule = require('path');
const toposort = require('toposort');
const logger = require('../common/logger');
const { checkoutAllAssets } = require('../asset/checkout_asset');

let graph;

async function initEtl(args) {
  let startPath = '.';
  const dest = args.getOption('dest', './etl_jobs_dir');
  console.log(`DEST: ${dest}`);
  startPath = args.getOption('start', './working_directory');
  await checkoutAllAssets(startPath).catch(e => { console.error(`Checkout error: ${e}`); });
  graph = { nodes: {}, edges: [] };
  processDirectory(startPath);
  console.log(JSON.stringify(graph));
  const result = { sequencedJobs: [], freeJobs: [] };
  toposort(graph.edges).reverse().forEach(jobName => {
    if (!Object.prototype.hasOwnProperty.call(graph.nodes, jobName)) {
      throw new Error(`No such job ${jobName}`);
    }
    result.sequencedJobs.push(graph.nodes[jobName]);
    delete graph.nodes[jobName];
  });
  // Remaining nodes have no dependencies, nor nodes that depend on them.
  Object.keys(graph.nodes).forEach(jName => {
    result.freeJobs.push(graph.nodes[jName]);
  });
  let fd = fs.openSync(`${dest}/etl_jobs_definition.json`, 'w');
  fs.writeFileSync(fd, JSON.stringify(result), { encoding: 'utf8' });
  fs.closeSync(fd);
  const d = Date.now();
  fd = fs.openSync(`${dest}/etl_jobs_date.json`, 'w');
  fs.writeFileSync(fd, JSON.stringify({ dateValue: d, dateString: new Date(d).toISOString() }));
  fs.closeSync(fd);
}

function processDirectory(path) {
  const files = fs.readdirSync(path);
  const defIndex = files.indexOf('mda.json');
  if (defIndex >= 0) {
    const fd = fs.openSync(`${path}/mda.json`, 'r');
    const mda = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
    if (mda.active) {
      const resolvedPath = pathModule.resolve(path);
      addToGraph(readEtlConfig(path), mda, resolvedPath);
    }
  }

  files.forEach(fileName => {
    const fullPath = `${path}/${fileName}`;
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    }
  });
}

function addToGraph(config, mda, path) {
  if (config) {
    addNode(createNode(mda.name, config, path, mda.depends), logger);
    // Add dependencies
    mda.depends.forEach(name => { graph.edges.push(createEdge(mda.name, name)); });
  }
}

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

function addNode(node) {
  if (!(node.name in graph.nodes)) graph.nodes[node.name] = node;
  else {
    logger.error(`Duplicate job name ${node.name}`);
  }
}

function createEdge(name1, name2) {
  return [name1, name2];
}

function readEtlConfig(path) {
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

module.exports = initEtl;
