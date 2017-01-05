const fs = require('fs');

const context = { initialized: false, types: '', endpoints: '' };

function normalizeName(name, useSpaces = false) {
  let newName = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  if (!useSpaces) newName = newName.replace(/ /g, '');
  return newName;
}

function dataSetName(dataDef, graphQlConfig) {
  let name;
  if ('name' in graphQlConfig) {
    name = graphQlConfig.name;
  } else {
    name = normalizeName(dataDef.name);
  }
  return name;
}

function appendGraphQlEndpoint(dataDef, config, graphQlConfig) {
  const name = dataSetName(dataDef, graphQlConfig);
  //   address ( id: ID! ): Address
  let parameters = '';
  let indent = '  ';
  if (graphQlConfig.parameters) {
    parameters = `( ${graphQlConfig.parameters.join(', ')} )`;
  }
  if (config.indent) {
    indent = ' '.repeat(config.indent);
  }
  return `${indent}# ${dataDef.description}\n${indent}${name.toLowerCase()}${parameters}: ${name}\n`;
}

function translateType(rawType) {
  let type = 'UNKNOWN';
  if (rawType.startsWith('varchar')) type = 'String';
  else if (rawType.startsWith('timestamp')) type = 'String';
  else if (rawType.startsWith('integer')) type = 'Int';
  else if (rawType.startsWith('bigint')) type = 'Int';
  else if (rawType.startsWith('numeric')) type = 'Float';
  else if (rawType.startsWith('boolean')) type = 'Boolean';
  else if (rawType.startsWith('geom')) type = 'String'; // for now
  // else if (rawType.startsWith('geom')) type = 'Geometry';
  return type;
}

function appendGraphQlType(dataDef, config, graphQlConfig) {
  const name = dataSetName(dataDef, graphQlConfig);
  let indent = '  ';
  if (config.indent) {
    indent = ' '.repeat(config.indent);
  }
  let typeDef = '';

  typeDef = `${indent}type ${name} {\n`;
  dataDef.columns.forEach(column => {
    const cName = column.column;
    let type = translateType(column.type);
    if (column.column in graphQlConfig.columns) {
      if ('type' in graphQlConfig.columns[column.column]) {
        type = graphQlConfig.columns[column.column].type;
      }
    }
    let desc = `${indent}  # ${column.name ? column.name : normalizeName(cName, true)}`;
    if (column.description) {
      desc += `: ${column.description}\n`;
    }
    typeDef += desc;

    typeDef += `${indent}  ${cName}: ${type}\n`;
  });
  typeDef += `${indent}}`;
  return typeDef;
}

function doGeneration(path, dest, config, logger) { // eslint-disable-line no-unused-vars
  let fd = fs.openSync(`${path}/dataset.json`, 'r');
  const ddef = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
  let graphqlConfig = { columns: {} };
  if (config.files.includes('graphql.json')) {
    fd = fs.openSync(`${path}/graphql.json`, 'r');
    graphqlConfig = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
  }

  context.types += appendGraphQlType(ddef, config, graphqlConfig);
  context.endpoints += appendGraphQlEndpoint(ddef, config, graphqlConfig);
}

function generate(path, dest, config, logger) {
  if (!context.initialized) {
    context.initialized = true;
  }
  doGeneration(path, dest, config, logger);
  let output = `const types = \`\n${context.types}\`;\nexport default types;\n`;
  let fd = fs.openSync(`${dest}/mda_types.js`, 'w');
  fs.writeFileSync(fd, output, { encoding: 'utf8' });
  output = `const endpoints = \`\n${context.endpoints}\`;\nexport default endpoints;\n`;
  fd = fs.openSync(`${dest}/mda_endpoints.js`, 'w');
  fs.writeFileSync(fd, output, { encoding: 'utf8' });
}

module.exports = generate;
