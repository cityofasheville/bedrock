
DELETE FROM bedrock.schema_columns WHERE table_name = 'coa_apd_traffic_stop_name_data_table';
INSERT INTO bedrock.schema_columns VALUES
('coa_apd_traffic_stop_name_data_table','traffic_stop_id',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_apd_traffic_stop_name_data_table','name_type',2,NULL,'YES','character',4,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_apd_traffic_stop_name_data_table','name_type_sequence',3,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('coa_apd_traffic_stop_name_data_table','name_age',4,NULL,'YES','character',2,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_apd_traffic_stop_name_data_table','name_race',5,NULL,'YES','character',2,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_apd_traffic_stop_name_data_table','name_sex',6,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_apd_traffic_stop_name_data_table','name_ethnicity',7,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('coa_apd_traffic_stop_name_data_table','traffic_stop_name_id',8,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('coa_apd_traffic_stop_name_data_table','_count',9,NULL,'YES','character varying',200,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'coa_apd_traffic_stop_name_data_table'; INSERT INTO bedrock.schemas VALUES ('coa_apd_traffic_stop_name_data_table',NULL,NOW());
