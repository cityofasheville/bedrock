/* eslint-disable no-console */
const fs = require('fs');
const CommandLineArgs = require('./common/CommandLineArgs');

function createAsset() {
  const args = new CommandLineArgs(process.argv.slice(2));
  if (args.argCount() < 2) usageAndExit();
  const newAsset = args.getArg(1);
  const startDir = args.getOption('start', '.');

  const fullpath = `${startDir}/${newAsset}`;
  if (!fs.existsSync(fullpath)) { fs.mkdirSync(fullpath); }
  // write mda.json
  const mdaStr = '{\n'
    + `  "name": "${newAsset}",\n`
    + '  "location": "",\n'
    + '  "active": true,\n'
    + '  "type": "",\n'
    + '  "description": "",\n'
    + '  "depends": [],\n'
    + '  "category": "",\n'
    + '  "tags": [],\n'
    + '  "schema": "",\n'
    + '  "title": "",\n'
    + '  "publication_date": "",\n'
    + '  "responsible_party": "",\n'
    + '  "responsible_party_role": "",\n'
    + '  "url": "",\n'
    + '  "abstract": "",\n'
    + '  "status": "",\n'
    + '  "update_frequency": "",\n'
    + '  "keywords": [],\n'
    + '  "use_constraints": "",\n'
    + '  "metadata_constraints": [],\n'
    + '  "resource_constraints": "",\n'
    + '  "topic_category": [],\n'
    + '  "geographic_extent" : {\n'
    + '      "east": "",\n'
    + '      "west": "",\n'
    + '      "north": "",\n'
    + '      "south": ""\n'
    + '   },\n'
    + '  "feature_catalog": "",\n'
    + '  "process_description": "",\n'
    + '  "spatial_reference": "",\n'
    + '  "metadata_creation_date": "",\n'
    + '  "contact_role_code": ""\n'
    + '}\n';

  const fileDataMda = new Uint8Array(Buffer.from(mdaStr));
  fs.writeFileSync(`${fullpath}/mda.json`, fileDataMda, 'utf8');

  // write etl.json
  const etlStr = '{\n'
    + '  "create": [],\n'
    + '  "distribute": [],\n'
    + '  "tasks": [\n'
    + '    {\n'
    + '      "type": "",\n'
    + '      "file": "",\n'
    + '      "active": false\n'
    + '    }\n'
    + '  ]\n'
    + '}\n';
  const fileDataEtl = new Uint8Array(Buffer.from(etlStr));
  fs.writeFileSync(`${fullpath }/etl.json`, fileDataEtl, 'utf8');
  console.log('New asset files created in folder ');
}

function usageAndExit() {
  console.log('Usage:\tbedrock create <new_asset_name>\n\n');
  process.exit(1);
}

module.exports = createAsset;
