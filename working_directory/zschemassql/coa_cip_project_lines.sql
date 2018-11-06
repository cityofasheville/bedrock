DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_cip_project_lines';
INSERT INTO bedrock.schema_columns VALUES
('coa_cip_project_lines','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_cip_project_lines','gis_id',2,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','projecttype',3,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','projectclass',4,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','subclass',5,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','sitetype',6,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','projectname',7,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','locationdescription',8,NULL,'YES','character varying',256,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','complete',9,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','gdb_geomattr_data',10,NULL,'YES','bytea',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','edit_by',11,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','edit_date',12,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_lines','shape',13,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_cip_project_lines'; INSERT INTO bedrock.schemas VALUES ('coa_cip_project_lines',NULL,NOW());
