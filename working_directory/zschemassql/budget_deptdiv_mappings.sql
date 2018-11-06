DELETE FROM bedrock.schema_columns WHERE table_name = 'budget_deptdiv_mappings';
INSERT INTO bedrock.schema_columns VALUES
('budget_deptdiv_mappings','dept_id1',1,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_deptdiv_mappings','div_id1',2,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_deptdiv_mappings','dept_id2',3,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_deptdiv_mappings','div_id2',4,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_deptdiv_mappings','department_name',5,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('budget_deptdiv_mappings','division_name',6,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'budget_deptdiv_mappings'; INSERT INTO bedrock.schemas VALUES ('budget_deptdiv_mappings',NULL,NOW());
