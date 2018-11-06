DELETE FROM bedrock.schema_columns WHERE table_name = 'capital_projects_master_categories';
INSERT INTO bedrock.schema_columns VALUES
('capital_projects_master_categories','category_name',1,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master_categories','display_order',2,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'capital_projects_master_categories'; INSERT INTO bedrock.schemas VALUES ('capital_projects_master_categories',NULL,NOW());
