const toposort = require('toposort');
const connectionManager = require('./scripts/db/connection_manager');

async function checkout() {
  const client = connectionManager.getConnection('bedrock');
  let sqlAsset = 'SELECT ast.id, ast.name, loc.short_name AS location, ast.active, ast.type, ast.description, ast.category,  '
  + 'ast.tags, ast.schema, ast.title, ast.publication_date, ast.responsible_party, '
  + 'ast.responsible_party_role, ast.url, ast.abstract, ast.status, ast.update_frequency, ast.keywords, '
  + 'ast.use_constraints, ast.metadata_constraints, ast.resource_constraints, ast.topic_category,  '
  + 'ast.geo_extent_east, ast.geo_extent_west, ast.geo_extent_north, ast.geo_extent_south, ast.feature_catalog,  '
  + 'ast.process_description, ast.spatial_reference, ast.metadata_creation_date, ast.contact_role_code '
  + 'FROM bedrock.assets ast ';

  const assets = await client.query(sqlAsset, queryArgs);
  return assets.rows;
}


