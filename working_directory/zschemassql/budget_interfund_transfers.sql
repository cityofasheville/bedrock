DELETE FROM bedrock.schema_columns WHERE table_name = 'budget_interfund_transfers';
INSERT INTO bedrock.schema_columns VALUES
('budget_interfund_transfers','org_code',1,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_interfund_transfers','object_code',2,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'budget_interfund_transfers'; INSERT INTO bedrock.schemas VALUES ('budget_interfund_transfers',NULL,NOW());
