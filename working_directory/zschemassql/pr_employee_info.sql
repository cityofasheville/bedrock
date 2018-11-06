DELETE FROM bedrock.schema_columns WHERE table_name = 'pr_employee_info';
INSERT INTO bedrock.schema_columns VALUES
('pr_employee_info','emp_id',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('pr_employee_info','active',2,NULL,'YES','character varying',1,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','employee',3,NULL,'YES','character varying',67,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','emp_email',4,NULL,'YES','character',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','ft_status',5,NULL,'YES','character',2,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','position',6,NULL,'YES','character',20,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','dept_id',7,NULL,'YES','character varying',2,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','department',8,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','div_id',9,NULL,'YES','character',4,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','division',10,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','sup_id',11,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('pr_employee_info','supervisor',12,NULL,'YES','character varying',67,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','sup_email',13,NULL,'YES','character',50,NULL,NULL,NULL,NULL,NULL,NULL),
('pr_employee_info','hire_date',14,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'pr_employee_info'; INSERT INTO bedrock.schemas VALUES ('pr_employee_info','Basic information for employees',NOW());
