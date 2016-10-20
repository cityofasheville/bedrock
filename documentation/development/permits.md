The following is a first attempt to define the fields we want on a permit. It builds on the [BLDS standard](https://github.com/open-data-standards/permitdata.org/wiki).

In addition to defining the fields we want, we'll need to divide them between data that can be open and data that needs to be kept private.
### Required

|Field|DataType|Description|BLDS Status|
|:---- |:---- |:------ |:------ |:------|
|PermitNum|TEXT|Permit number|Required|
|Description|TEXT|Detailed description of work permitted|Required|
|AppliedDate<sup>1</sup>|TEXT (YYYY-MM-DD)|Date on which the permit was applied|Required|
|ApplicantName|TEXT|Name of applicant. May want to add other information as well|-|
|IssuedDate<sup>1</sup>|TEXT (YYYY-MM-DD)|Date on which the permit was issued|Required|
|CompletedDate<sup>2</sup>|TEXT (YYYY-MM-DD)|Date on which the permit was completed.|Required|
|Stage|TEXT|Name of the current stage. Permitted values: <ul> <li>Application</li> <li>Review</li> <li>Issuance</li> <li>...TBD</li> </ul>|-|
|StageStatus|TEXT|Current status of permit within current stage. Permitted values:<ul><li>Started</li> <li>NotStarted</li> <li>Complete</li> <li>N/A</li></ul>|-|
|StatusCurrent<sup>2</sup>|TEXT|BLDS-required value indicating current status of permit. This field should use only standardized values defined by BLDS so we don't have to implement the BLDS-recommended StatusCurrentMapped field <ul><li>Application Accepted</li><li>Fees/Payment</li><li>In Review</li><li>Permit Issued</li><li>Inspection Phase</li><li>Permit Finaled</li><li>Permit Finaled with Conditions</li><li>Occupancy</li><li>Appeal</li><li>Permit Cancelled</li></ul>|Required|
|StatusCurrentMapped|TEXT|StatusCurrent mapped to standardized values:<ul><li>Application Accepted</li><li>Fees/Payment</li><li>In Review</li><li>Permit Issued</li><li>Inspection Phase</li><li>Permit Finaled</li><li>Permit Finaled with Conditions</li><li>Occupancy</li><li>Appeal</li><li>Permit Cancelled</li></ul>|Recommended|
|CivicAddressId|TEXT|Asheville civic address id| - |
|OriginalAddress1|TEXT|Original property street address (line 1).|Required|
|OriginalAddress2|TEXT|Original property street address (line 2).|Required|
|OriginalCity|TEXT|Original property city.|Required|
|OriginalState|TEXT|Original property state|Required|
|OriginalZip|TEXT|Original property zip code.|Required|
|Jurisdiction|TEXT|Unique ID of jurisdiction Census ID: 3702140. Per discussion [here](https://github.com/open-data-standards/permitdata.org/issues/70), we should use the US Census Bureau ID, which appears to use [ANSI ids](https://www.census.gov/geo/reference/codes/cou.html). Also helpful is [Census page on GEOIDs](https://www.census.gov/geo/reference/geoidentifiers.html)|Recommended|
|PermitClass|TEXT|Raw values indicating property type (e.g. Commercial or Residential) using our internal designations.|Recommended|
|PermitClassMapped|TEXT|PermitClass mapped to standardized values:<ul><li>Residential (Single Family/Duplex)</li><li>Non-Residential (Commercial, Industrial, Institutional)</li></ul>|Recommended|
|WorkClass|TEXT|Raw values indicating whether a property is new or existing|Recommended|
|WorkClassMapped|TEXT|WorkClass mapped to standardized values:<ul><li>New</li><li>Existing</li></ul>|Recommended|
|PermitType|TEXT|Raw values indicating type of permit in abbreviated/shorthand format|Recommended|
|PermitTypeMapped|TEXT|PermitType mapped to standardized values:<ul><li>Building</li><li>Demolition</li><li>Electrical</i><li>Mechanical</li><li>Plumbing</li><li>Roof</li><li>Fence</li>Grading</li><li>Pool/Spa</li></ul>|Recommended|
|PermitTypeDesc|TEXT|Longer description of permit type|Recommended|
|StatusDate|TEXT (YYYY-MM-DD)|Indicates the last time a permit was updated in the jurisdiction’s database|Recommended|
|TotalSqFt|INTEGER|Total square footage relevant to the permit|Recommended|
|Link|TEXT|This field should provide a web URL to where the permit data is hosted online.|Recommended|
|Latitude|NUMERIC|Latitude of property in decimal format using geographic coordinates|Recommended|
|Longitude|NUMERIC|Longitude of property in decimal format using geographic coordinates|Recommended|
|EstProjectCost|NUMERIC|Estimated value of the project.|Recommended|
|HousingUnits|INTEGER|Number of household units for a given building|Recommended|
|PIN|TEXT|Primary unique identifier for a land parcel within a jurisdiction used for tax assessment purposes. The identifier may be colloquially referred to as assessor's ID, tax ID, parcel number, etc.|Recommended|
|ContractorId|TEXT|ID of the main contractor (contractors stored in a separate dataset)| - |
|OtherContractors|JSON|Rather than (or in addition to) storing additional contractors in a separate dataset keyed by permit number, seems more useful internally to have an array of other contractor IDs|-|
|ContractorCompanyName|TEXT|Primary company name of the contractor|Recommended|
|ContractorTrade|TEXT|Raw values indicating contractor trade|Recommended|
|ContractorTradeMapped|TEXT|Trade mapped to standardized values:<ul><li>General</li><li>Electrical</li><li>Mechanical</li><li>Plumbing</li><li>Architecture</li><li>Engineering</li><li>Masonry</li><li>Sign</li><li>Tent</li></ul>|Recommended|
|ContractorLicNum|TEXT|Contractor license number|Recommended|
|ContractorStateLic|TEXT|Indicates the state the contractor is licensed to|Recommended|
|ProposedUse|TEXT|Provides a description of the use of the property (land use or otherwise) for the permitted work|Optional|
|AddedSqFt|INTEGER|The square footage the project will add to property|Optional|
|RemovedSqFt|INTEGER|The square footage the project will remove from the property|Optional|
|MasterPermitNum|TEXT|Master Use Permit number|Optional|
|ExpiresDate|TEXT (YYYY-MM-DD)|Date on which the permit will/would have expire(d)|Optional|
|COIssuedDate|TEXT (YYYY-MM-DD)|Date on which the related certificate of occupancy was issued|Optional|
|HoldDate|TEXT (YYYY-MM-DD)|Date on which the permit was last put on hold|Optional|
|VoidDate|TEXT (YYYY-MM-DD)|Date on which the permit was voided|Optional|
|ProjectName|TEXT|Name of the project related to the permit|Optional|
|ProjectID|TEXT|ID within the jurisdiction’s database of the project related to the permit|Optional|
|TotalFinishedSqFt|TEXT|Total finished square footage relevant to the permit|Optional|
|TotalUnfinishedSqFt|TEXT|Total unfinished square footage relevant to the permit|Optional|
|TotalHeatedSqFt|TEXT|Total heated square footage relevant to the permit|Optional|
|TotalUnHeatedSqFt|TEXT|Total unheated square footage relevant to the permit|Optional|
|TotalAccSqFt|TEXT|Total accessory square footage relevant to the permit|Optional|
|TotalSprinkledSqFt|TEXT|Total sprinkled square footage relevant to the permit|Optional|
|ExtraFields|JSON|Source fields that could not logically map to one of the above fields.|Optional|
|Publisher|TEXT|The name of the data publisher/authority (county, city)|Optional|
|Fee|INTEGER|The fee for the permit (in any currency)|Optional|
|ContractorFullName|TEXT|Full name of the contractor (Individual or Company)|Optional|
|ContractorCompanyDesc|TEXT|Company description|Optional|
|ContractorPhone|TEXT|Contractor phone number|Optional|
|ContractorAddress1|TEXT|Contractor street address line 1|Optional|
|ContractorAddress2|TEXT|Contractor street address line 2|Optional|
|ContractorCity|TEXT|Contractor city|Optional|
|ContractorState|TEXT|Contractor state|Optional|
|ContractorZip|TEXT|Contractor zip|Optional|
|ContractorEmail|TEXT|Contractor email address|Optional|
| ??? | | What other fields should we add? | - |
1. Either of ```AppliedDate``` or ```IssuedDate``` is required. If both are available, both should be provided.
2. Either of ```CompletedDate``` or ```StatusCurrent``` must be provided. If both are available, both should be provided.
