In some cases, more than one contractor may be associated with a given permit.  The contractor information included in the core dataset should be for the primary contractor.  If additional contractors need to be associated, additional datasets for each contractor may be submitted and lined to the core dataset through the following information.

### Required

|Field|DataType|Description|
|:------ |:------ |:------ |
|PermitNum|TEXT|Provides data link back to core permits information by permit number|

### Recommended
|Field|DataType|Description|
|:------ |:------ |:------ |
|ContractorCompanyName2|TEXT|Secondary company name of contractor if applicable|
|ContractorTrade2|TEXT|Raw values indicating contractor trade.|
|ContractorTradeMapped2|TEXT|Trade mapped to standardized values:<ul><li>General</li><li>Electrical</li><li>Mechanical</li><li>Plumbing</li><li>Architecture</li><li>Engineering</li></ul>|
|ContractorLicNum2|TEXT|Contractor license number|
|ContractorStateLicense2|TEXT|Indicates the state the contractor is licensed to|

### Optional

|Field|DataType|Description|
|:------ |:------ |:------ |
|ContractorFullName2|TEXT|Full name of the contractor (Individual or Company)|
|ContractorCompanyDesc2|TEXT|Company description|
|ContractorPhone2|TEXT|Contractor phone number|
|ContractorAddress1_2|TEXT|Contractor street address line 1|
|ContractorAddress2_2|TEXT|Contractor street address line 2|
|ContractorCity2|TEXT|Contractor city|
|ContractorState2|TEXT|Contractor state|
|ContractorZip2|TEXT|Contractor zip|
|ContractorEmail2|TEXT|Contractor email address|