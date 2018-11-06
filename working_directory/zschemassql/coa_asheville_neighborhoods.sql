DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_asheville_neighborhoods';
INSERT INTO bedrock.schema_columns VALUES
('coa_asheville_neighborhoods','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_asheville_neighborhoods','name',2,NULL,'YES','character varying',25,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_asheville_neighborhoods','nbhd_id',3,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_asheville_neighborhoods','abbreviation',4,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_asheville_neighborhoods','narrative',5,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_asheville_neighborhoods','edit_date',6,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_asheville_neighborhoods','edit_by',7,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_asheville_neighborhoods','st_area_shape_',8,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_asheville_neighborhoods','st_length_shape_',9,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_asheville_neighborhoods','shape',10,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_asheville_neighborhoods'; INSERT INTO bedrock.schemas VALUES ('coa_asheville_neighborhoods',NULL,NOW());
