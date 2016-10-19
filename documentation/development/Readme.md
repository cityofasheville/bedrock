# Building & Land Development Specification

### Current Version 

The current version is ```1.2```

### Overview

The following information provides a draft standard applied to permits data (building and construction) for city and county jurisdictions.  The standard was initially developed through a collective process inclusive of stakeholders (Zillow, BuildFax, Socrata, SiteCompli, Accela, CivicInsight, Buildingeye, DriveDecisions)  within the Housing and Real Estate Sector of the Open Data Network.  It was acknowledged that a standard specific for permits as applied to the housing and real estate sector was lacking, and in order to have better structured data flowing from producer (public sector) to consumers (citizens, developers and mass consumer applications), a more defined standard was needed.  By having more structured data, the use cases for these data increase dramatically, and therefore, add more value to the data.  A draft standard was generated as a way to seed the discussion and then opened up into this forum for wider comment and contribution.

The data standard is first organized by **Core** and **Optional** Dataset Requirements.  

Core Requirements reference the information needed for assembling a core permits dataset to which Optional Data Requirements for contractor or inspections data can be connected to.  Therefore, permits level data makes up the core, while contractor and inspections level data are optional.

Within each of these sets (Core and Optional Datasets), fields are categorized as Required, Recommended or Optional:

* Required:  Essential data field.  The fields are absolutely necessary to have the basic level of data necessary to make this a useful dataset.  
* Recommended:  These fields are highly recommended in order to make the data useful.  If these data are available, then they should be submitted.  
* Optional:  Nice to have fields.  These fields also provide additional information, and if the data exists, they should be submitted.

Note that in some cases, one of several fields is the requirement (in the case of dates), and in other cases both raw and standardized lists are provided as options for fields that could be more easily interpreted with standard categories.  

This data standard was developed understanding that there are many variations across jurisdictions on how permits data is captured.  By keeping the required number of fields low, the likelihood of jurisdictions (across city and county) being able to comply with the standard increases.  Ideally, there would be a number of recommended fields that also get submitted by jurisdictions. 

For each field, a Field Name, Data Type (data format) and description is given.  In the field descriptions, standardized lists for categories are also provided in some cases for which descriptions are also given.

### Requirements 

* [Core Permits Dataset Requirements](Core-Permits-Dataset-Requirements)
* [Optional Permit Status Change Dataset Requirements](Optional-Permit-Status-Change-Dataset-Requirements)
* [Optional Contractor Dataset Requirements](Optional-Contractor-Dataset-Requirements)
* [Optional Inspections Dataset Requirements](Optional-Inspections-Dataset-Requirements)
* [Appendix A](Appendix-A) - List of values for <code>InspTypeMapped</code>