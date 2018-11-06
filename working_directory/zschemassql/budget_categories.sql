DELETE FROM bedrock.schema_columns WHERE table_name = 'budget_categories';
INSERT INTO bedrock.schema_columns VALUES
('budget_categories','id',1,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_categories','category',2,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'budget_categories'; INSERT INTO bedrock.schemas VALUES ('budget_categories',NULL,NOW());
