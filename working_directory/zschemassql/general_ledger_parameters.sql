DELETE FROM bedrock.schema_columns WHERE table_name = 'general_ledger_parameters';
INSERT INTO bedrock.schema_columns VALUES
('general_ledger_parameters','id',1,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('general_ledger_parameters','parm',2,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','budgetrequest_level1_description',3,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','budgetrequest_level2_description',4,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','budgetrequest_level3_description',5,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','budgetrequest_level4_description',6,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','budgetrequest_level5_description',7,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','useprojectcode',8,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','usebudgetarycontrol',9,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','defaultyear',10,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','defaultperiod',11,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','budgetcarryforwardmethod',12,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','currentyear',13,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','currentperiod',14,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','beginningfiscalyeardate',15,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('general_ledger_parameters','endfiscalyeardate',16,NULL,'YES','timestamp without time zone',NULL,NULL,NULL,NULL,6,NULL,NULL),
('general_ledger_parameters','iscurrentyearheldopen',17,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','finalbudgetlevel',18,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','balancesegment1_length',19,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','balancesegment2_length',20,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','balancesegment3_length',21,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','balancesegment4_length',22,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','balancesegment5_length',23,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','balancesegment6_length',24,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','balancesegment7_length',25,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','balancesegment8_length',26,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','expensesegment1_length',27,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','expensesegment2_length',28,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','expensesegment3_length',29,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','expensesegment4_length',30,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','expensesegment5_length',31,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','expensesegment6_length',32,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','expensesegment7_length',33,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','expensesegment8_length',34,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','revenuesegment1_length',35,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','revenuesegment2_length',36,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','revenuesegment3_length',37,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','revenuesegment4_length',38,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','revenuesegment5_length',39,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','revenuesegment6_length',40,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','revenuesegment7_length',41,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','revenuesegment8_length',42,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','segment1_longdescription',43,NULL,'YES','character varying',12,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment2_longdescription',44,NULL,'YES','character varying',12,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment3_longdescription',45,NULL,'YES','character varying',12,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment4_longdescription',46,NULL,'YES','character varying',12,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment5_longdescription',47,NULL,'YES','character varying',12,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment6_longdescription',48,NULL,'YES','character varying',12,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment7_longdescription',49,NULL,'YES','character varying',12,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment8_longdescription',50,NULL,'YES','character varying',12,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment1_shortdescription',51,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment2_shortdescription',52,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment3_shortdescription',53,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment4_shortdescription',54,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment5_shortdescription',55,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment6_shortdescription',56,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment7_shortdescription',57,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','segment8_shortdescription',58,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','totalsegments',59,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','delimiter',60,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','grantsegment',61,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','grantexpcatsegment',62,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','includereqamountsinbudgetchecks',63,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','yearend',64,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','balancetosegment',65,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','accountcodecheck',66,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','allowrevenueaccountswithencumbrance',67,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','enforcedefaultyear',68,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','isrollupcodepromptactive',69,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','accountrestrictionformultipleroles',70,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','scheduledupdatedefaultperiod',71,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('general_ledger_parameters','synchronizationformatcode',72,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','journalexportformat',73,NULL,'YES','character varying',10,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','displaylongobject',74,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','defaultjournalstatus',75,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','autopostjournal',76,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','autocreategeneralbilling',77,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','postdateflag',78,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','summ_pr_je',79,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','pocan_carryforwardbudget',80,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','podefaultyear',81,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','podefaultperiod',82,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','ardefaultyear',83,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','ardefaultperiod',84,NULL,'YES','smallint',NULL,16,2,0,NULL,NULL,NULL),
('general_ledger_parameters','contjournal',85,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','nextyearbua',86,NULL,'YES','character',1,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','version',87,NULL,'YES','bytea',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','pcashfund',88,NULL,'YES','character varying',4,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','fiscalyearstartmonthid',89,NULL,'YES','integer',NULL,32,2,0,NULL,NULL,NULL),
('general_ledger_parameters','verifycashlevel',90,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','enforcecfwdbudget',91,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','autogeneratedtdf',92,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','usenyrollups',93,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('general_ledger_parameters','usegenerojournalentry',94,NULL,'YES','boolean',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
DELETE FROM bedrock.schemas WHERE table_name = 'general_ledger_parameters'; INSERT INTO bedrock.schemas VALUES ('general_ledger_parameters','Various GL parameters, especially budget year',NOW());
