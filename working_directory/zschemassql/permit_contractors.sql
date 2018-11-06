DELETE FROM bedrock.schema_columns WHERE table_name = 'permit_contractors';
INSERT INTO bedrock.schema_columns VALUES
('permit_contractors','permit_num',1,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('permit_contractors','contractor_name',2,NULL,'YES','character varying',255,NULL,NULL,NULL,NULL,NULL,NULL),
('permit_contractors','contractor_license_number',3,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('permit_contractors','record_id',4,NULL,'YES','character varying',17,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'permit_contractors'; INSERT INTO bedrock.schemas VALUES ('permit_contractors','Permit contractors data',NOW());
