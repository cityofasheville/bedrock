function loadSchemas(asset, client){ 
  if(asset.name === "Load_All_Asset_Schemas"){
    let sqlInsertSchemaCol_All = 'INSERT INTO bedrock.schema_columns(' +
      'table_catalog, table_schema, table_name, column_name, ordinal_position, column_default, is_nullable, data_type, character_maximum_length, numeric_precision, numeric_precision_radix, numeric_scale, datetime_precision, interval_type, interval_precision) ' +
      'SELECT table_catalog, table_schema, table_name, column_name, ordinal_position, column_default, is_nullable, ' +
      'data_type, character_maximum_length, numeric_precision, numeric_precision_radix, ' +
      'numeric_scale, datetime_precision, interval_type, interval_precision ' +
      'FROM information_schema.columns where table_schema = $1;';
    client.query('DELETE FROM bedrock.schema_columns;')
    .then(client.query(sqlInsertSchemaCol_All, [ 'internal' ]))
    .catch(e => {console.error('query error', e.message, e.stack); });
  }else{
      let sqlInsertSchemaCol = 'INSERT INTO bedrock.schema_columns(' +
      'table_catalog, table_schema, table_name, column_name, ordinal_position, column_default, is_nullable, data_type, character_maximum_length, numeric_precision, numeric_precision_radix, numeric_scale, datetime_precision, interval_type, interval_precision) ' +
      'SELECT table_catalog, table_schema, table_name, column_name, ordinal_position, column_default, is_nullable, ' +
      'data_type, character_maximum_length, numeric_precision, numeric_precision_radix, ' +
      'numeric_scale, datetime_precision, interval_type, interval_precision ' +
      'FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2;';
    client.query('DELETE FROM bedrock.schema_columns WHERE table_name = $1;', [ asset.name ])
    .then(client.query('DELETE FROM bedrock.schemas WHERE table_name = $1;', [ asset.name ]))
    .then(client.query(sqlInsertSchemaCol, [ 'internal', asset.name ]))
    .then(client.query('INSERT INTO bedrock.schemas VALUES ($1, $2, NOW());', [ asset.name, asset.description ]))
    .catch(e => {console.error('query error', e.message, e.stack); });
  }
}

/*
SQL

SELECT table_catalog, table_schema, table_name, column_name, ordinal_position, column_default, 
is_nullable, data_type, character_maximum_length, numeric_precision, numeric_precision_radix,
numeric_scale, datetime_precision, interval_type, interval_precision
FROM information_schema.columns where table_schema = 'bedrock'

*/