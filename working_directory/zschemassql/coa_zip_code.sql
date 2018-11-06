DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_zip_code';
INSERT INTO bedrock.schema_columns VALUES
('coa_zip_code','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_zip_code','bc_zipcode',2,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_zip_code','bc_zipco_1',3,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_zip_code','zip',4,NULL,'YES','character varying',5,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zip_code','po_name',5,NULL,'YES','character varying',28,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zip_code','state',6,NULL,'YES','character varying',2,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zip_code','sumblkpop',7,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_zip_code','pop2000',8,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_zip_code','citycode',9,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zip_code','edit_date',10,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_zip_code','edit_by',11,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zip_code','gdb_geomattr_data',12,NULL,'YES','bytea',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zip_code','shape',13,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_zip_code'; INSERT INTO bedrock.schemas VALUES ('coa_zip_code','Asheville zip code areas',NOW());
