DELETE FROM bedrock.schema_columns WHERE table_name = 'bc_public_incident_data';
INSERT INTO bedrock.schema_columns VALUES
('bc_public_incident_data','incident_id',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('bc_public_incident_data','agency',2,NULL,'YES','character',4,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','date_occurred',3,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('bc_public_incident_data','case_number',4,NULL,'YES','character varying',12,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','address',5,NULL,'YES','character varying',75,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','geo_beat',6,NULL,'YES','character',4,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','geo_report_area',7,NULL,'YES','character',4,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','geo_x',8,NULL,'YES','numeric',NULL,13,10,2,NULL,NULL,NULL),
('bc_public_incident_data','geo_y',9,NULL,'YES','numeric',NULL,13,10,2,NULL,NULL,NULL),
('bc_public_incident_data','offense_short_description',10,NULL,'YES','character varying',25,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','offense_long_description',11,NULL,'YES','character varying',60,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','offense_code',12,NULL,'YES','character',4,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','offense_group_code',13,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','offense_group_level',14,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','offense_group_short_description',15,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','offense_group_long_description',16,NULL,'YES','character varying',1000,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_public_incident_data','_count',17,NULL,'YES','character varying',200,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'bc_public_incident_data'; INSERT INTO bedrock.schemas VALUES ('bc_public_incident_data','Crime incident data from RMS',NOW());
