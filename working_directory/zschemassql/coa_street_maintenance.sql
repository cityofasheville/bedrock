DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_street_maintenance';
INSERT INTO bedrock.schema_columns VALUES
('coa_street_maintenance','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_street_maintenance','centerline_id',2,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_street_maintenance','full_street_name',3,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_street_maintenance','maintenance_entity',4,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_street_maintenance','furtherinfo',5,NULL,'YES','character varying',150,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_street_maintenance','frommeasure',6,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_street_maintenance','tomeasure',7,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_street_maintenance','edit_date',8,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_street_maintenance','edit_by',9,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_street_maintenance','st_length_shape_',10,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_street_maintenance','shape',11,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_street_maintenance'; INSERT INTO bedrock.schemas VALUES ('coa_street_maintenance',NULL,NOW());
