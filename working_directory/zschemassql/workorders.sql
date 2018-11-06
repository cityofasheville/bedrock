DELETE FROM bedrock.schema_columns WHERE table_name = 'workorders';
INSERT INTO bedrock.schema_columns VALUES
('workorders','id',1,NULL,'NO','integer',NULL,32,2,0,NULL,NULL,NULL),
('workorders','parent_id',2,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('workorders','respondby',3,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('workorders','summary',4,NULL,'YES','character varying',100,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','type',5,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','requestor',6,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','requested_date',7,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('workorders','resolution_date',8,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('workorders','elapsed_time',9,NULL,'YES','character varying',20,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','priority',10,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','due_date',11,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('workorders','assigned_technician',12,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','date_completed',13,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('workorders','hours',14,NULL,'YES','real',NULL,24,2,NULL,NULL,NULL,NULL),
('workorders','department',15,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','notes',16,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','resolution',17,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','current_status',18,NULL,'YES','character varying',255,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','incident_or_service_req',19,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','hotlist',20,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','date_responded',21,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('workorders','work_order_type_name',22,NULL,'YES','character varying',255,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','sub_type',23,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','text1',24,NULL,'YES','character varying',40,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','text4',25,NULL,'YES','character varying',40,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','forward_project',26,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','org_impact',27,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','requestor_priority',28,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','task_lookup_6',29,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','task_lookup_7',30,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','it_involvement',31,NULL,'YES','character varying',50,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','assndate',32,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('workorders','wo_type_3',33,NULL,'YES','character varying',30,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','status',34,NULL,'YES','character varying',25,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','wo_text_2',35,NULL,'YES','character varying',40,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','wo_text_3',36,NULL,'YES','character varying',40,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','wo_text_5',37,NULL,'YES','character varying',40,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','wo_text_6',38,NULL,'YES','character varying',40,NULL,NULL,NULL,NULL,NULL,NULL),
('workorders','wo_num_1',39,NULL,'YES','real',NULL,24,2,NULL,NULL,NULL,NULL),
('workorders','wo_int_1',40,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'workorders'; INSERT INTO bedrock.schemas VALUES ('workorders','TrackIT workorder data',NOW());
