DELETE FROM bedrock.schema_columns WHERE table_name = 'pcard_transaction';
INSERT INTO bedrock.schema_columns VALUES
('pcard_transaction','dept_id',1,NULL,'YES','character varying',2,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_transaction','department',2,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_transaction','div_id',3,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_transaction','division',4,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_transaction','cardholder',5,NULL,'YES','character',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_transaction','statement_id',6,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('pcard_transaction','charge_date',7,NULL,'YES','date',NULL,NULL,NULL,NULL,0,NULL,NULL),
('pcard_transaction','amount',8,NULL,'YES','numeric',NULL,13,10,2,NULL,NULL,NULL),
('pcard_transaction','vendor_id',9,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('pcard_transaction','vendor_name',10,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_transaction','description',11,NULL,'YES','character',100,NULL,NULL,NULL,NULL,NULL,NULL),
('pcard_transaction','receipt',12,NULL,'YES','character varying',1,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'pcard_transaction'; INSERT INTO bedrock.schemas VALUES ('pcard_transaction',NULL,NOW());
