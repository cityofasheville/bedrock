Inspections data overall is optional.  If Inspections data exists, then the following provides which fields should be required, recommended and optional to make the dataset useful, which can be linked back to the core permits dataset by the PermitNum field.

### Required

|Field|DataType|Description|
|:------ |:------ |:------ |
|PermitNum|TEXT|Provides data link back to core permits information by permit number|
|InspType|TEXT|Raw values indicating type of inspection in abbreviated/shorthand|
|InspTypeMapped <sup>1</sup>|TEXT|InspType mapped to standardized values.|
|Result|TEXT|Raw values indicating result of inspection|
|ResultMapped|TEXT|Result mapped to standardized values:<ul><li>Passed</li><li>Rejected</li><li>Partial</li><li>Cancelled</li><li>OK for Service</li></ul>|
|ScheduledDate <sup>2</sup>|TEXT (YYYY-MM-DD)|Date scheduled for inspection|
|InspectedDate|TEXT (YYYY-MM-DD)|Actual date inspected|

### Recommended
|Field|DataType|Description|
|:------ |:------ |:------ |
|InspectionNotes|TEXT|Notes from the inspector. <sup>3</sup>|

### Optional

|Field|DataType|Description|
|:------ |:------ |:------ |
|Description|TEXT|Longer description of inspection|
|Final|TEXT|Indicator as to whether or not the inspection is a final inspection (Yes or No)|
|RequestDate|TEXT (YYYY-MM-DD)|Date on which the inspection was requested|
|RequestTime|TEXT|Time at which the inspection was requested|
|DesiredDate|TEXT (YYYY-MM-DD)|Date desired for inspection|
|DesiredTime|TEXT|Time desired for inspection|
|ScheduledTime|TEXT|Time scheduled for inspection|
|InspectedTime|TEXT|Actual time inspected|
|ReInspection|TEXT|Indicator as to whether a reinspection is needed (Yes or No)|
|Inspector|TEXT|Name and/or identifier of inspector|
|ExtraFields|JSON|Source fields that could not logically map to one of the above fields.|


1. See [Appendix A](Appendix-A)
2. Note that only one of the dates for *ScheduledDate* or *InspectedDate* is required.  However, if both dates are available, both should be submitted.
3. If populated after a failed inspection, usually consists of an explanation of why the inspection failed.