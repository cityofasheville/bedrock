DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_national_register_properties';
INSERT INTO bedrock.schema_columns VALUES
('coa_national_register_properties','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_national_register_properties','id',2,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_national_register_properties','name',3,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_national_register_properties','area_type',4,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_national_register_properties','edit_date',5,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_national_register_properties','edit_by',6,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_national_register_properties','st_area_shape_',7,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_national_register_properties','st_length_shape_',8,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_national_register_properties','nr_pdfs',9,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_national_register_properties','shape',10,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_national_register_properties'; INSERT INTO bedrock.schemas VALUES ('coa_national_register_properties','National register properties',NOW());
