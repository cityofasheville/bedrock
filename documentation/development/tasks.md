I initialized this table by starting from the [BLDS inspections dataset](https://github.com/open-data-standards/permitdata.org/wiki/Optional-Inspections-Dataset-Requirements), although inspections are just one type of task in the Asheville table.

|Field|DataType|Description|BLDS Status|
|:------ |:------ |:------ |:------|
|PermitNum|TEXT|Provides data link back to core permits information by permit number|Required|
|TaskType|TEXT|Type of the task:<ul><li>Review</li><li>Inspection</li> <li>Customer</li></ul>|-|
|TaskSubType|TEXT|E.g., type of inspection - equivalent to BLDS _InspType_|-|
|InspType|TEXT|Raw values indicating type of inspection in abbreviated/shorthand. Note that this is identical to _TaskSubType_|Required|
|TaskDivision|TEXT|What division this task is associated with|-|
|Owner|TEXT|Who owns this task (inspector name/id, reviewer name/id, customer name)|-|
|TaskSLA|TEXT (YYYY-MM-DD)|When this task is/was due|-|
|TaskStart|TEXT (YYYY-MM-DD HH:MM:SS)|What did we mean by this? Is this, e.g., actual inspection time, or equivalent to one of the below? It's ok to duplicate one of below in order to have a uniform field to use for inspections and non-inspections tasks.|-|
|TaskEnd|TEXT (YYYY-MM-DD HH:MM:SS)|See previous|-|
|InspTypeMapped<sup>1</sup>|TEXT|InspType mapped to standardized values.|Required|
|Result|TEXT|Raw values indicating result of inspection|Required|
|ResultMapped|TEXT|Result mapped to standardized values:<ul><li>Passed</li><li>Rejected</li><li>Partial</li><li>Cancelled</li><li>OK for Service</li></ul>|Required|
|ScheduledDate <sup>2</sup>|TEXT (YYYY-MM-DD)|Date scheduled for inspection|Required|
|InspectedDate|TEXT (YYYY-MM-DD)|Actual date inspected|Required|
|InspectionNotes|TEXT|Notes from the inspector. <sup>3</sup>|Recommended|
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
|Type-specific data|??|We had listed type-specific data. This has inspection-specific data from the BLDS standard. Do we need similar fields for other types?|-|
|Anything else?|??|??|-|


1. See [Appendix A](./Appendix-A.md)
2. Note that only one of the dates for *ScheduledDate* or *InspectedDate* is required.  However, if both dates are available, both should be submitted.
3. If populated after a failed inspection, usually consists of an explanation of why the inspection failed.
