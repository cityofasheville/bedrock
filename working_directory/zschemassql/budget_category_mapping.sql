DELETE FROM bedrock.schema_columns WHERE table_name = 'budget_category_mapping';
INSERT INTO bedrock.schema_columns VALUES
('budget_category_mapping','object_code',1,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_category_mapping','category',2,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_category_mapping','description',3,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'budget_category_mapping'; INSERT INTO bedrock.schemas VALUES ('budget_category_mapping',NULL,NOW());
