DELETE FROM bedrock.schema_columns WHERE table_name = 'permits';
INSERT INTO bedrock.schema_columns VALUES
('permits','permit_num',1,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','permit_group',2,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','permit_type',3,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','permit_subtype',4,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','permit_category',5,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','applicant_name',6,NULL,'YES','character varying',255,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','permit_description',7,NULL,'YES','character varying',4000,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','applied_date',8,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('permits','status_current',9,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','status_date',10,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('permits','created_by',11,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','building_value',12,NULL,'YES','character varying',500,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','job_value',13,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('permits','total_project_valuation',14,NULL,'YES','character varying',500,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','total_sq_feet',15,NULL,'YES','character varying',500,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','fees',16,NULL,'YES','numeric',NULL,15,10,2,NULL,NULL,NULL),
('permits','paid',17,NULL,'YES','numeric',NULL,15,10,2,NULL,NULL,NULL),
('permits','balance',18,NULL,'YES','numeric',NULL,15,10,2,NULL,NULL,NULL),
('permits','invoiced_fee_total',19,NULL,'YES','double precision',NULL,53,2,NULL,NULL,NULL,NULL),
('permits','civic_address_id',20,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('permits','record_id',21,NULL,'YES','character varying',17,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'permits'; INSERT INTO bedrock.schemas VALUES ('permits','Permits data',NOW());
