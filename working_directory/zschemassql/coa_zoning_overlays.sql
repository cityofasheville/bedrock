DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_zoning_overlays';
INSERT INTO bedrock.schema_columns VALUES
('coa_zoning_overlays','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_zoning_overlays','name',2,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','label',3,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','narrative',4,NULL,'YES','character varying',150,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','date',5,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_zoning_overlays','zoning_district',6,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','ordinance',7,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','calculated_acreage',8,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','edit_date',9,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_zoning_overlays','edit_by',10,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','overlay_type',11,NULL,'YES','character varying',150,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','status',12,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','st_area_shape_',13,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','st_length_shape_',14,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('coa_zoning_overlays','shape',15,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_zoning_overlays'; INSERT INTO bedrock.schemas VALUES ('coa_zoning_overlays','Asheville zoning overlays',NOW());
