DELETE FROM bedrock.schema_columns WHERE table_name = 'bc_street_midpoint_view';
INSERT INTO bedrock.schema_columns VALUES
('bc_street_midpoint_view','shape',1,NULL,'YES','USER-DEFINED',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('bc_street_midpoint_view','objectid',2,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('bc_street_midpoint_view','centerline_id',3,NULL,'YES','numeric',NULL,38,10,8,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'bc_street_midpoint_view'; INSERT INTO bedrock.schemas VALUES ('bc_street_midpoint_view',NULL,NOW());
