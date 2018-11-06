DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_districts_public_works';
INSERT INTO bedrock.schema_columns VALUES
('coa_districts_public_works','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_districts_public_works','truckday',2,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_public_works','truck_num',3,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('coa_districts_public_works','brushtruck_num',4,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('coa_districts_public_works','sweep_district',5,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_public_works','recdistrict',6,NULL,'YES','character varying',2,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_public_works','recday',7,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_public_works','comments',8,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_public_works','edit_date',9,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_districts_public_works','edit_by',10,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_public_works','st_area_shape_',11,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_districts_public_works','st_length_shape_',12,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_districts_public_works','brushweek',13,NULL,'YES','character varying',25,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_public_works','shape',14,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_districts_public_works'; INSERT INTO bedrock.schemas VALUES ('coa_districts_public_works','Public works districts',NOW());
