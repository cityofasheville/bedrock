DELETE FROM bedrock.schema_columns WHERE table_name = 'pcard_statement_status_history';
INSERT INTO bedrock.schema_columns VALUES
('pcard_statement_status_history','dept_id',1,NULL,'YES','character varying',2,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_statement_status_history','department',2,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_statement_status_history','div_id',3,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_statement_status_history','division',4,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_statement_status_history','cardholder',5,NULL,'YES','character',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_statement_status_history','statement_code',6,NULL,'YES','character',10,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_statement_status_history','statement_id',7,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('pcard_statement_status_history','statement_status',8,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_statement_status_history','fiscal_year',9,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('pcard_statement_status_history','fiscal_period',10,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('pcard_statement_status_history','invoiced_date',11,NULL,'YES','date',NULL,NULL,NULL,NULL,0,NULL,NULL),
('pcard_statement_status_history','reconciled_date',12,NULL,'YES','date',NULL,NULL,NULL,NULL,0,NULL,NULL),
('pcard_statement_status_history','days_invoiced_to_reconciled',13,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('pcard_statement_status_history','approved_date',14,NULL,'YES','date',NULL,NULL,NULL,NULL,0,NULL,NULL),
('pcard_statement_status_history','days_reconciled_to_approved',15,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('pcard_statement_status_history','days_since_invoiced',16,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('pcard_statement_status_history','days_since_reconciled',17,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'pcard_statement_status_history'; INSERT INTO bedrock.schemas VALUES ('pcard_statement_status_history','PCard transactions and status',NOW());
