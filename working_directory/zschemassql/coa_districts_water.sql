DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_districts_water';
INSERT INTO bedrock.schema_columns VALUES
('coa_districts_water','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_districts_water','id',2,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_districts_water','district',3,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_water','mrc',4,NULL,'YES','character varying',3,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_water','edit_date',5,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_districts_water','edit_by',6,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_water','gdb_geomattr_data',7,NULL,'YES','bytea',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_water','shape',8,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_districts_water'; INSERT INTO bedrock.schemas VALUES ('coa_districts_water','Asheville water districts',NOW());
