DELETE FROM bedrock.schema_columns WHERE table_name = 'bc_property_pinnum_formatted_owner_names';
INSERT INTO bedrock.schema_columns VALUES
('bc_property_pinnum_formatted_owner_names','formatted_owner_name',1,NULL,'YES','character varying',200,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_property_pinnum_formatted_owner_names','pinnum',2,NULL,'YES','character varying',200,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'bc_property_pinnum_formatted_owner_names'; INSERT INTO bedrock.schemas VALUES ('bc_property_pinnum_formatted_owner_names','Preprocessed owner names',NOW());
