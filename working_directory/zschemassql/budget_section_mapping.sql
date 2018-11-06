DELETE FROM bedrock.schema_columns WHERE table_name = 'budget_section_mapping';
INSERT INTO bedrock.schema_columns VALUES
('budget_section_mapping','org_code',1,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_section_mapping','object_code',2,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_section_mapping','budget_section',3,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_section_mapping','description',4,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'budget_section_mapping'; INSERT INTO bedrock.schemas VALUES ('budget_section_mapping',NULL,NOW());
