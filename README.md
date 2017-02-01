# ComplexCity Managed Data System
Scripts and metadata for City of Asheville reporting and management data infrastrucutre.

## Design Goals

1. Provide high-quality metadata to reporting & management data users
2. Maintain the integrity of the relationship between reporting and source data
  * Sequence and run ETL jobs that create the reporting data warehouse
  * Maintain information on data provenance, i.e., help us answer two questions:
    * How is this dataset created?
    * Where is this dataset being used in the data infrastructure?
3. Maintain the integrity of the relationship between the data and applications that use it
  * Generate GraphQL schema information for use in SimpliCity
  * Future possibility: answer question "What data is involved in this functionality?


The system consists of a set of [metadata directories](./datasets) describing all the datasets in our reporting and management warehouse together with a few [scripts](./scripts/README.md) that use the metadata to create and maintain data infrastructure.


