DELETE FROM bedrock.schema_columns WHERE table_name = 'bc_location';
INSERT INTO bedrock.schema_columns VALUES
('bc_location','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('bc_location','location_id',2,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('bc_location','locationtype',3,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('bc_location','civicaddress_id',4,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('bc_location','parent_location_id',5,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('bc_location','building_id',6,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('bc_location','centerline_id',7,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('bc_location','user_id',8,NULL,'YES','character varying',8,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_location','esn',9,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('bc_location','x_coord',10,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('bc_location','y_coord',11,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('bc_location','commcode',12,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_location','primary_structure',13,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('bc_location','create_date',14,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('bc_location','change_date',15,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('bc_location','parcel_id',16,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_location','shape',17,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'bc_location'; INSERT INTO bedrock.schemas VALUES ('bc_location','Locations table from County',NOW());
