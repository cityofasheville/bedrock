DELETE FROM bedrock.schema_columns WHERE table_name = 'employees_main_view';
INSERT INTO bedrock.schema_columns VALUES
('employees_main_view','emp_id',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('employees_main_view','active',2,NULL,'YES','character varying',1,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','employee',3,NULL,'YES','character varying',67,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','emp_email',4,NULL,'YES','character',50,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','ft_status',5,NULL,'YES','character',2,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','position',6,NULL,'YES','character',20,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','dept_id',7,NULL,'YES','character varying',2,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','department',8,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','div_id',9,NULL,'YES','character',4,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','division',10,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','sup_id',11,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('employees_main_view','supervisor',12,NULL,'YES','character varying',67,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','sup_email',13,NULL,'YES','character',50,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','hire_date',14,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('employees_main_view','ad_username',15,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('employees_main_view','ad_memberships',16,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'employees_main_view'; INSERT INTO bedrock.schemas VALUES ('employees_main_view',NULL,NOW());
