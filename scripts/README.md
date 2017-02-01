# Processing Scripts

There are two key scripts.

__```Metarun.js [options] command_name```__

Walks the hierarchy of dataset directories. When if finds a directory associatedwith a managed data asset (indicated by the existence of a ```dataset.json``` file), it calls a script specified by ```command_name```. Commands currently include:

* __validate__ - validates that the data described in the ```dataset.json```` file matches the tables used for input and output <sup>1</sup>.
* __etl__ - creates a schedule of (and, soon, parameter files for) ETL jobs based on dependencies between datasets. The output is a job file used by ```jobrun.js```.
* __graphql__ - outputs GraphQL schema snippets for the dataset for use in SimpliCity (and, soon, default resolvers and dataset dashboard configuration files).

__```Jobrun.js [options] working_directory```__

Designed to be called from a scheduler like ```cron```. When called with the ```--init``` option, it starts off a sequence of runs, kicking off as many ETL jobs from the job file as can be accommodated (each job is assigned 1 or more points and the script will allow up to ```--parallelLoad``` points to run simultaneously). Each time it is called, it harvests any completed jobs and starts the next set, guaranteeing that no job runs before anything it depends on. If an error occurs, all dependent jobs are canceled, but processing of anything not dependent on the failed job continues.

### Notes

<sup>1</sup> One of the tenets of the system is that it should be dumb - any logic required to create the view or table used should be maintained by the data steward outside of the ComplexCity system.
