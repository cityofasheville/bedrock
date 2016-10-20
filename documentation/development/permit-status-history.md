This is the table that stores all the history of status changes for a permit. It also serves as the [Optional Status Change Dataset](https://github.com/open-data-standards/permitdata.org/wiki/Optional-Permit-Status-Change-Dataset-Requirements) in BLDS.

Fields included in the core dataset indicate current permit status, however, this dataset can be linked to a more historical record if available.
### Required

|Field|DataType|Description|BLDS Status|
|:------ |:------ |:------ |:------|
|PermitNum|TEXT|Provides data link back to core permits information by permit number|Required|
|StatusPrevious|TEXT|Provides raw text for previous status of permit|Recommended|
|PreviousStage|TEXT|Name of the previous stage. Permitted values: <ul> <li>Application</li> <li>Review</li> <li>Issuance</li> <li>...TBD</li> </ul>|-|
|PreviousStageStatus|TEXT|Status of permit within previous stage. Permitted values:<ul><li>Started</li> <li>NotStarted</li> <li>Complete</li> <li>N/A</li></ul>|-|
|StatusPreviousDate|TEXT (YYYY-MM-DD)|Indicates the last time a permit was updated in the jurisdiction’s database, but may also be a composite of the above dates.|Recommended|
|StatusPreviousMapped|TEXT|StatusPrevious mapped to standardized values:<ul><li>Application Accepted</li><li>In Review</li><li>Permit Issued</li><li>Inspection Phase</li><li>Permit Finaled</li><li>Permit Cancelled</li></ul>|Optional|
|ActiveTasks|JSON|Counts of active tasks: total, owned by City, owned by Customer| - |
|CriticalPathDate|JSON|Next SLA date|-|
|CriticalPathDays|JSON|Time used & left|-|
|SLSViolationCount|INTEGER|Total times we've violated SLA so far|-|
|SLSViolationDays|INTEGER| Total days we've accumulated in violation
|Comments|TEXT|Provides any additional comments regarding permit status that may be included in the dataset.|Optional|
