The following provides the [required](#required), [recommended](#recommended) and [optional](#optional) fields for the core permits dataset.

### Required

|Field|DataType|Description|
|:------ |:------ |:------ |
|PermitNum|TEXT|Permit number|
|Description|TEXT|Detailed description of work permitted|
|AppliedDate<sup>1</sup>|TEXT (YYYY-MM-DD)|Date on which the permit was applied|
|IssuedDate<sup>1</sup>|TEXT (YYYY-MM-DD)|Date on which the permit was issued|
|CompletedDate<sup>2</sup>|TEXT (YYYY-MM-DD)|Date on which the permit was completed.|
|StatusCurrent<sup>2</sup>|TEXT|Raw values indicating current status of permit|
|OriginalAddress1|TEXT|Original property street address (line 1), as stored by the jurisdiction|
|OriginalAddress2<sup>3</sup>|TEXT|Original property street address (line 2), as stored by the jurisdiction|
|OriginalCity|TEXT|Original property city, as stored by the jurisdiction|
|OriginalState|TEXT|Original property state, as stored by the jurisdiction|
|OriginalZip|TEXT|Original property zip code, as stored by the jurisdiction|

### Recommended
|Field|DataType|Description|
|:------ |:------ |:------ |
|Jurisdiction|TEXT|Unique ID of jurisdiction|
|PermitClass|TEXT|Raw values indicating property type (e.g. Commercial or Residential)|
|PermitClassMapped|TEXT|PermitClass mapped to standardized values:<ul><li>Residential (Single Family/Duplex)</li><li>Non-Residential (Commercial, Industrial, Institutional)</li></ul>|
|StatusCurrentMapped|TEXT|StatusCurrent mapped to standardized values: <ul><li>Application Accepted</li><li>Fees/Payment</li><li>In Review</li><li>Permit Issued</li><li>Inspection Phase</li><li>Permit Finaled</li><li>Permit Finaled with Conditions</li><li>Occupancy</li><li>Appeal</li><li>Permit Cancelled</li></ul>|
|WorkClass|TEXT|Raw values indicating whether a property is new or existing|
|WorkClassMapped|TEXT|WorkClass mapped to standardized values:<ul><li>New</li><li>Existing</li></ul>|
|PermitType|TEXT|Raw values indicating type of permit in abbreviated/shorthand format|
|PermitTypeMapped|TEXT|PermitType mapped to standardized values:<ul><li>Building</li><li>Demolition</li><li>Electrical</i><li>Mechanical</li><li>Plumbing</li><li>Roof</li><li>Fence</li>Grading</li><li>Pool/Spa</li></ul>|
|PermitTypeDesc|TEXT|Longer description of permit type|
|StatusDate|TEXT (YYYY-MM-DD)|Indicates the last time a permit was updated in the jurisdiction’s database|
|TotalSqFt|INTEGER|Total square footage relevant to the permit|
|Link|TEXT|This field should provide a web URL to where the permit data is hosted online.<sup>4</sup>|
|Latitude|NUMERIC|Latitude of property in decimal format using geographic coordinates|
|Longitude|NUMERIC|Longitude of property in decimal format using geographic coordinates|
|EstProjectCost|NUMERIC|Estimated value of the project.|
|HousingUnits|INTEGER|Number of household units for a given building|
|PIN|TEXT|Primary unique identifier for a land parcel within a jurisdiction used for tax assessment purposes. The identifier may be colloquially referred to as assessor's ID, tax ID, parcel number, etc.|
|ContractorCompanyName|TEXT|Primary company name of the contractor|
|ContractorTrade|TEXT|Raw values indicating contractor trade|
|ContractorTradeMapped|TEXT|Trade mapped to standardized values:<ul><li>General</li><li>Electrical</li><li>Mechanical</li><li>Plumbing</li><li>Architecture</li><li>Engineering</li><li>Masonry</li><li>Sign</li><li>Tent</li></ul>|
|ContractorLicNum|TEXT|Contractor license number|
|ContractorStateLic|TEXT|Indicates the state the contractor is licensed to|

### Optional

|Field|DataType|Description|
|:------ |:------ |:------ |
|ProposedUse|TEXT|Provides a description of the use of the property (land use or otherwise) for the permitted work|
|AddedSqFt|INTEGER|The square footage the project will add to property|
|RemovedSqFt|INTEGER|The square footage the project will remove from the property|
|MasterPermitNum|TEXT|Master Use Permit number|
|ExpiresDate|TEXT (YYYY-MM-DD)|Date on which the permit will/would have expire(d)|
|COIssuedDate|TEXT (YYYY-MM-DD)|Date on which the related certificate of occupancy was issued|
|HoldDate|TEXT (YYYY-MM-DD)|Date on which the permit was last put on hold|
|VoidDate|TEXT (YYYY-MM-DD)|Date on which the permit was voided|
|ProjectName|TEXT|Name of the project related to the permit|
|ProjectID|TEXT|ID within the jurisdiction’s database of the project related to the permit|
|TotalFinishedSqFt|TEXT|Total finished square footage relevant to the permit|
|TotalUnfinishedSqFt|TEXT|Total unfinished square footage relevant to the permit|
|TotalHeatedSqFt|TEXT|Total heated square footage relevant to the permit|
|TotalUnHeatedSqFt|TEXT|Total unheated square footage relevant to the permit|
|TotalAccSqFt|TEXT|Total accessory square footage relevant to the permit|
|TotalSprinkledSqFt|TEXT|Total sprinkled square footage relevant to the permit|
|ExtraFields|JSON|Source fields that could not logically map to one of the above fields.|
|Publisher|TEXT|The name of the data publisher/authority (county, city)|
|Fee|INTEGER|The fee for the permit (in any currency)|
|ContractorFullName|TEXT|Full name of the contractor (Individual or Company)|
|ContractorCompanyDesc|TEXT|Company description|
|ContractorPhone|TEXT|Contractor phone number|
|ContractorAddress1|TEXT|Contractor street address line 1|
|ContractorAddress2|TEXT|Contractor street address line 2|
|ContractorCity|TEXT|Contractor city|
|ContractorState|TEXT|Contractor state|
|ContractorZip|TEXT|Contractor zip|
|ContractorEmail|TEXT|Contractor email address|
1. Either of ```AppliedDate``` or ```IssuedDate``` is required. If both are available, both should be provided. 
2. Either of ```CompletedDate``` or ```StatusCurrent``` must be provided. If both are available, both should be provided. 
3. If system of record used by jurisdiction makes this address component available.
4. Ideally there should be no login.  Users should be able to click on the link and be taken straight to all the online information regarding the permit.