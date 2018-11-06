DELETE FROM bedrock.schema_columns WHERE table_name = 'budget_exclusions';
INSERT INTO bedrock.schema_columns VALUES
('budget_exclusions','org_code',1,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_exclusions','object_code',2,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'budget_exclusions'; INSERT INTO bedrock.schemas VALUES ('budget_exclusions',NULL,NOW());
