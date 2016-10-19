An optional dataset information file may be published to provide meta information about the data.

### Required

Field|DataType|Description|
|:------ |:------ |:------ |
|Jurisdiction|TEXT|Unique ID of jurisdiction|
|Version |NUMERIC|Version of the BLDS specification used to generate BLDS data. For example '1.0'|
|Email|TEXT|Email address of the person to contact regarding invalid data in this data file or feed|

### Recommended
Field|DataType|Description|
|:------ |:------ |:------ |
|LastUpdate|TEXT (YYYY-MM-DD)|Date that the file or data feed was last updated|
|Projection|TEXT|Projection system used for coordinates provided with permit records|

### Optional
Field|DataType|Description|
|:------ |:------ |:------ |
|URL|TEXT|URL where the jurisdiction publishes building permit data|
|Phone|TEXT|Telephone number of the person to contact regarding invalid data in this data file or feed|
|Fax|TEXT| Fax number of the person to contact regarding invalid data in this data file or feed|