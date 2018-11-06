DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_overlay_historic_districts_property_view';
INSERT INTO bedrock.schema_columns VALUES
('coa_overlay_historic_districts_property_view','shape',1,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_overlay_historic_districts_property_view','objectid',2,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_overlay_historic_districts_property_view','pinnum',3,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_overlay_historic_districts_property_view','owner',4,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_overlay_historic_districts_property_view','historic_district_name',5,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_overlay_historic_districts_property_view'; INSERT INTO bedrock.schemas VALUES ('coa_overlay_historic_districts_property_view',NULL,NOW());

