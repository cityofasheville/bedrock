DELETE FROM bedrock.schema_columns WHERE table_name = 'capital_projects_master';
INSERT INTO bedrock.schema_columns VALUES
('capital_projects_master','gis_id',1,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','munis_project_number',2,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','project',3,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','display_name',4,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','location_details',5,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','zip_code',6,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','type',7,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','category',8,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','coa_contact',9,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','phone_number',10,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','email_address',11,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','owner_department',12,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','administering_department',13,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','project_description',14,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','map_tab',15,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','status',16,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','total_project_funding__budget_document_',17,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','target_construction_start',18,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','target_construction_end',19,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','actual_construction_end',20,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','amount_behind_schedule',21,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','estimated_construction_duration',22,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','project_folder',23,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','project_webpage__more_information_',24,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','communication_plan',25,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','photo_url',26,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','project_updates',27,NULL,'YES','text',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('capital_projects_master','objectid',28,'nextval('internal.capital_projects_master_objectid_seq'::regclass)','NO','integer',NULL,32,2,0,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'capital_projects_master'; INSERT INTO bedrock.schemas VALUES ('capital_projects_master',NULL,NOW());
