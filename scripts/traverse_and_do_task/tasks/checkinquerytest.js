      let sqlInsert = 'INSERT INTO bedrock.assets( ' +
                      // ' name, location, active, type, description, category, tags, schema, title, publication_date, ' +
                      // ' responsible_party, responsible_party_role, url, abstract, status, update_frequency, keywords, ' +
                      // ' use_constraints, metadata_constraints, resource_constraints, topic_category, ' +
                      // ' geo_extent_east, geo_extent_west, geo_extent_north, geo_extent_south, feature_catalog, ' +
                      // ' process_description, spatial_reference, metadata_creation_date, contact_role_code ) ' +
                      ' name, location, active, type, description, category,  schema, title, publication_date, ' +
                      ' responsible_party, responsible_party_role, url, abstract, status, update_frequency,  ' +
                      ' use_constraints,  resource_constraints,  ' +
                      ' geo_extent_east, geo_extent_west, geo_extent_north, geo_extent_south, feature_catalog, ' +
                      ' process_description, spatial_reference, metadata_creation_date, contact_role_code ) ' +

                      ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, ' +
                      ' $20, $21, $22, $23, $24, $25, $26)' +  //, $27, $28, $29, $30
                      ' ON CONFLICT (name, location) DO UPDATE SET ' +
                      ' active = excluded.active, ' +
                      ' type = excluded.type, ' +
                      ' description = excluded.description, ' +
                      ' category = excluded.category, ' +
                      //' tags = excluded.tags, ' + //[]
                      ' schema = excluded.schema, ' +
                      ' title = excluded.title, ' +
                      ' publication_date = excluded.publication_date, ' +
                      ' responsible_party = excluded.responsible_party, ' +
                      ' responsible_party_role = excluded.responsible_party_role, ' +
                      ' url = excluded.url, ' +
                      ' abstract = excluded.abstract, ' +
                      ' status = excluded.status, ' +
                      ' update_frequency = excluded.update_frequency, ' +
                      //' keywords = excluded.keywords, ' + //[]
                      ' use_constraints = excluded.use_constraints, ' +
                      //' metadata_constraints = excluded.metadata_constraints, ' + //[]
                      ' resource_constraints = excluded.resource_constraints, ' +
                      //' topic_category = excluded.topic_category, ' + //[]
                      ' geo_extent_east = excluded.geo_extent_east, ' +
                      ' geo_extent_west = excluded.geo_extent_west, ' +
                      ' geo_extent_north = excluded.geo_extent_north, ' +
                      ' geo_extent_south = excluded.geo_extent_south, ' +
                      ' feature_catalog = excluded.feature_catalog, ' +
                      ' process_description = excluded.process_description, ' +
                      ' spatial_reference = excluded.spatial_reference, ' +
                      ' metadata_creation_date = excluded.metadata_creation_date, ' +
                      ' contact_role_code = excluded.contact_role_code ' +
                      ' RETURNING id;' ;
      client.query(sqlInsert, [asset.name, asset.loc_id, asset.active, asset.type, asset.description, asset.category, 
        asset.schema, asset.title, asset.publication_date, asset.responsible_party, asset.responsible_party_role, 
        asset.url, asset.abstract, asset.status, asset.update_frequency, asset.use_constraints, 
        asset.resource_constraints, asset.geographic_extent.east, 
        asset.geographic_extent.west, asset.geographic_extent.north, asset.geographic_extent.south, asset.feature_catalog, 
        asset.process_description, asset.spatial_reference, asset.metadata_creation_date, asset.contact_role_code])
      // client.query(sqlInsert, [asset.name, asset.loc_id, asset.active, asset.type, asset.description, asset.category, 
      //   asset.tags, asset.schema, asset.title, asset.publication_date, asset.responsible_party, asset.responsible_party_role, 
      //   asset.url, asset.abstract, asset.status, asset.update_frequency, asset.keywords, asset.use_constraints, 
      //   asset.metadata_constraints, asset.resource_constraints, asset.topic_category, asset.geo_extent_east, 
      //   asset.geo_extent_west, asset.geo_extent_north, asset.geo_extent_south, asset.feature_catalog, 
      //   asset.process_description, asset.spatial_reference, asset.metadata_creation_date, asset.contact_role_code])