DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_local_historic_landmarks';
INSERT INTO bedrock.schema_columns VALUES
('coa_local_historic_landmarks','objectid',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_local_historic_landmarks','new_pin',2,NULL,'YES','character varying',15,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_local_historic_landmarks','id_num',3,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('coa_local_historic_landmarks','ll_name',4,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_local_historic_landmarks','address',5,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_local_historic_landmarks','ordinance',6,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_local_historic_landmarks','eff_date',7,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('coa_local_historic_landmarks','notes',8,NULL,'YES','character varying',80,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_local_historic_landmarks','edit_by',9,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_local_historic_landmarks','edit_date',10,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_local_historic_landmarks'; INSERT INTO bedrock.schemas VALUES ('coa_local_historic_landmarks','coa_local_historic_landmarks',NOW());
