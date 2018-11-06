DELETE FROM bedrock.schema_columns WHERE table_name = 'permit_comments';
INSERT INTO bedrock.schema_columns VALUES
('permit_comments','permit_num',1,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('permit_comments','comment_seq_number',2,NULL,'YES','bigint',NULL,64,2,0,NULL,NULL,NULL),
('permit_comments','comment_date',3,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('permit_comments','comments',4,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'permit_comments'; INSERT INTO bedrock.schemas VALUES ('permit_comments','Permit comments data',NOW());
