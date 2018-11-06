DELETE FROM bedrock.schema_columns WHERE table_name = 'ad_info';
INSERT INTO bedrock.schema_columns VALUES
('ad_info','emp_id',1,NULL,'NO','integer',NULL,32,2,0,NULL,NULL,NULL),
('ad_info','ad_username',2,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('ad_info','ad_enabled',3,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('ad_info','email_city',4,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('ad_info','phone_desk',5,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('ad_info','phone_cell',6,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('ad_info','ad_memberships',7,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'ad_info'; INSERT INTO bedrock.schemas VALUES ('ad_info','AD information for employees',NOW());
