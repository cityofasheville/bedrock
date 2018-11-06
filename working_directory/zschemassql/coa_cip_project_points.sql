DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_cip_project_points';
INSERT INTO bedrock.schema_columns VALUES
('coa_cip_project_points','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_cip_project_points','gis_id',2,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_points','projecttype',3,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_points','projectclass',4,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_points','subclass',5,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_points','sitetype',6,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_points','projectname',7,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_points','locationdescription',8,NULL,'YES','character varying',256,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_points','complete',9,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_points','edit_date',10,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_points','edit_by',11,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_points','shape',12,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_cip_project_points'; INSERT INTO bedrock.schemas VALUES ('coa_cip_project_points',NULL,NOW());
