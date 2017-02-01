# ComplexCity Managed Data System
Scripts and metadata for City of Asheville reporting and management data infrastrucutre.

## Design Goals

1. Provide high-quality metadata to reporting & management data users
2. Sequence and run ETL jobs that create the reporting data warehouse
3. Maintain the integrity of the relationship between the data and applications that use it (e.g., SimpliCity)
4. Maintain information on data provenance, i.e., help us answer two questions:
  * How is this dataset created?
  * Where is this dataset being used in the data infrastructure?


The system consists of a set of [metadata directories](./datasets) describing all the datasets in our reporting and management warehouse together with a few [scripts](./scripts/README.md) that use the metadata to create and maintain data infrastructure.



