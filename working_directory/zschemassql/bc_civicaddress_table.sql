DELETE FROM bedrock.schema_columns WHERE table_name = 'bc_civicaddress_table';
INSERT INTO bedrock.schema_columns VALUES
('bc_civicaddress_table','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('bc_civicaddress_table','civicaddress_id',2,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','location_id',3,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','street_number',4,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('bc_civicaddress_table','unit',5,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','unit_type',6,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('bc_civicaddress_table','street_prefix',7,NULL,'YES','character varying',2,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','street_name',8,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','street_type',9,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','street_postdirection',10,NULL,'YES','character varying',2,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','full_civic_address',11,NULL,'YES','character varying',40,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','create_date',12,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('bc_civicaddress_table','change_date',13,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('bc_civicaddress_table','user_id',14,NULL,'YES','character varying',8,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','postal_code',15,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('bc_civicaddress_table','commcode',16,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','street_dupe',17,NULL,'YES','character varying',3,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_civicaddress_table','pinext',18,NULL,'YES','character varying',5,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'bc_civicaddress_table'; INSERT INTO bedrock.schemas VALUES ('bc_civicaddress_table','Civic address table from County',NOW());
