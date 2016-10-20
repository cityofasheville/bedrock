Inspections data overall is optional.  If Inspections data exists, then the following provides which fields should be required, recommended and optional to make the dataset useful, which can be linked back to the core permits dataset by the PermitNum field.

### Required

|Field|DataType|Description|BLDS Status|
|:------ |:------ |:------ |:------|
|PermitNum|TEXT|Provides data link back to core permits information by permit number|Required|
|InspType|TEXT|Raw values indicating type of inspection in abbreviated/shorthand|Required|
|InspTypeMapped <sup>1</sup>|TEXT|InspType mapped to standardized values.|Required|
|Result|TEXT|Raw values indicating result of inspection|Required|
|ResultMapped|TEXT|Result mapped to standardized values:<ul><li>Passed</li><li>Rejected</li><li>Partial</li><li>Cancelled</li><li>OK for Service</li></ul>|Required|
|ScheduledDate <sup>2</sup>|TEXT (YYYY-MM-DD)|Date scheduled for inspection|Required|
|InspectedDate|TEXT (YYYY-MM-DD)|Actual date inspected|Required|

### Recommended
|Field|DataType|Description|
|:------ |:------ |:------ |
|InspectionNotes|TEXT|Notes from the inspector. <sup>3</sup>|Recommended|

### Optional

|Field|DataType|Description|
|:------ |:------ |:------ |
|Description|TEXT|Longer description of inspection|Optional|
|Final|TEXT|Indicator as to whether or not the inspection is a final inspection (Yes or No)|Optional|
|RequestDate|TEXT (YYYY-MM-DD)|Date on which the inspection was requested|Optional|
|RequestTime|TEXT|Time at which the inspection was requested|Optional|
|DesiredDate|TEXT (YYYY-MM-DD)|Date desired for inspection|Optional|
|DesiredTime|TEXT|Time desired for inspection|Optional|
|ScheduledTime|TEXT|Time scheduled for inspection|Optional|
|InspectedTime|TEXT|Actual time inspected|Optional|
|ReInspection|TEXT|Indicator as to whether a reinspection is needed (Yes or No)|Optional|
|Inspector|TEXT|Name and/or identifier of inspector|Optional|
|ExtraFields|JSON|Source fields that could not logically map to one of the above fields.|Optional|


1. See [Appendix A](./Appendix-A.md)
2. Note that only one of the dates for *ScheduledDate* or *InspectedDate* is required.  However, if both dates are available, both should be submitted.
3. If populated after a failed inspection, usually consists of an explanation of why the inspection failed.
