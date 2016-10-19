An optional permit status change dataset is included in the case there is more detailed information that tracks the history of the permit.  Fields included in the core dataset indicate current permit status, however, this dataset can be linked to a more historical record if available.
### Required

|Field|DataType|Description|
|:------ |:------ |:------ |
|PermitNum|TEXT|Provides data link back to core permits information by permit number|

### Recommended
|Field|DataType|Description|
|:------ |:------ |:------ |
|StatusPrevious|TEXT|Provides raw text for previous status of permit|
|StatusPreviousDate|TEXT (YYYY-MM-DD)|Indicates the last time a permit was updated in the jurisdiction’s database, but may also be a composite of the above dates.|

### Optional

|Field|DataType|Description|
|:------ |:------ |:------ |
|StatusPreviousMapped|TEXT|StatusPrevious mapped to standardized values:<ul><li>Application Accepted</li><li>In Review</li><li>Permit Issued</li><li>Inspection Phase</li><li>Permit Finaled</li><li>Permit Cancelled</li></ul>|
|Comments|TEXT|Provides any additional comments regarding permit status that may be included in the dataset.|