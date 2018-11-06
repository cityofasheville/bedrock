DELETE FROM bedrock.schema_columns WHERE table_name = 'dsd_first_review_sla';
INSERT INTO bedrock.schema_columns VALUES
('dsd_first_review_sla','record_id',1,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','first_date',2,NULL,'YES','bigint',NULL,64,2,0,NULL,NULL,NULL),
('dsd_first_review_sla','record_type',3,NULL,'YES','character varying',255,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','group',4,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','type',5,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','sub_type',6,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','category',7,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','task',8,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','task_status',9,NULL,'YES','character varying',200,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','sla_desc',10,NULL,'YES','character varying',4000,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','start',11,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','sla',12,NULL,'YES','numeric',NULL,28,10,1,NULL,NULL,NULL),
('dsd_first_review_sla','due',13,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','first_plan_reviewed_date',14,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','month',15,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('dsd_first_review_sla','year',16,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('dsd_first_review_sla','met_sla',17,NULL,'YES','character varying',1,NULL,NULL,NULL,NULL,NULL,NULL),
('dsd_first_review_sla','sla_business',18,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('dsd_first_review_sla','worked_days_business',19,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'dsd_first_review_sla'; INSERT INTO bedrock.schemas VALUES ('dsd_first_review_sla','DSD first-review SLA performance',NOW());
