DELETE FROM bedrock.schema_columns WHERE table_name = 'budget_sections';
INSERT INTO bedrock.schema_columns VALUES
('budget_sections','id',1,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_sections','budget_section',2,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'budget_sections'; INSERT INTO bedrock.schemas VALUES ('budget_sections',NULL,NOW());
