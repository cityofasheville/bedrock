DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_cip_project_polygons';
INSERT INTO bedrock.schema_columns VALUES
('coa_cip_project_polygons','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_cip_project_polygons','gis_id',2,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','projecttype',3,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','projectclass',4,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','subclass',5,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','sitetype',6,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','projectname',7,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','locationdescription',8,NULL,'YES','character varying',256,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','complete',9,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','gdb_geomattr_data',10,NULL,'YES','bytea',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','edit_by',11,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','edit_date',12,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_cip_project_polygons','shape',13,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_cip_project_polygons'; INSERT INTO bedrock.schemas VALUES ('coa_cip_project_polygons',NULL,NOW());
