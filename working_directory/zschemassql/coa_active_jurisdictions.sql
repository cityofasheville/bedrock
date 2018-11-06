DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_active_jurisdictions';
INSERT INTO bedrock.schema_columns VALUES
('coa_active_jurisdictions','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_active_jurisdictions','areaname',2,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_active_jurisdictions','acres',3,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_active_jurisdictions','sqmiles',4,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_active_jurisdictions','cityname',5,NULL,'YES','character varying',9,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_active_jurisdictions','edit_date',6,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_active_jurisdictions','edit_by',7,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_active_jurisdictions','jurisdiction_type',8,NULL,'YES','character varying',150,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_active_jurisdictions','label',9,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_active_jurisdictions','gdb_geomattr_data',10,NULL,'YES','bytea',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_active_jurisdictions','shape',11,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_active_jurisdictions'; INSERT INTO bedrock.schemas VALUES ('coa_active_jurisdictions','Asheville corporate limits',NOW());
