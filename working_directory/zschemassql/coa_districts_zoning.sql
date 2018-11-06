DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_districts_zoning';
INSERT INTO bedrock.schema_columns VALUES
('coa_districts_zoning','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_districts_zoning','districts',2,NULL,'YES','character varying',12,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_zoning','municodepage',3,NULL,'YES','character varying',254,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_zoning','acreage',4,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_districts_zoning','squaremiles',5,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_districts_zoning','pp_weight',6,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('coa_districts_zoning','edit_date',7,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_districts_zoning','edit_by',8,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_zoning','pid',9,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_districts_zoning','max_impervious',10,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_districts_zoning','date',11,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_districts_zoning','ordinance',12,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_districts_zoning','st_area_shape_',13,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_districts_zoning','st_length_shape_',14,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_districts_zoning','shape',15,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_districts_zoning'; INSERT INTO bedrock.schemas VALUES ('coa_districts_zoning','Asheville zoning districts',NOW());
