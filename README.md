# OLD VERSION: see (Bedrock 2)[https://github.com/cityofasheville/bedrock2]
# Bedrock

System for data inventory and dependency management

## Processing Scripts

There are two key scripts.

__```h_apply.js [options] command_name```__

Walks the hierarchy of dataset directories. When if finds a directory associatedwith a managed data asset (indicated by the existence of a ```mda.json``` file), it calls a script specified by ```command_name```. Commands currently include:

* __validate__ - validates that the data described in the ```dataset.json```` file matches the tables used for input and output <sup>1,2</sup>.
* __etl__ - creates a schedule of (and, soon, parameter files for) ETL jobs based on dependencies between datasets. The output is a job file used by ```etl_run.js```.
* __graphql__ - outputs GraphQL schema snippets for the dataset for use in SimpliCity (and, soon, default resolvers and dataset dashboard configuration files).

node ./scripts/h_apply.js etl --recurse --start=../managed-data-assets/ --dest=../etl-jobs/

__```etl_run.js [options] working_directory```__

Designed to be called from a scheduler like ```cron```. Each time it is called, it harvests any completed jobs and starts the next set, kicking off as many ETL jobs from the job file as can be accommodated (each job is assigned 1 or more points and the script will allow up to ```--parallelLoad``` points to run simultaneously), guaranteeing that no job runs before anything it depends on. If an error occurs, all dependent jobs are canceled, but processing of anything not dependent on the failed job continues.

node ./etl_run.js ../jobs

## License

This project is licensed under the GPL V3 license. For more information see the [license file](./license.md).

## Code of Conduct

We have adopted the Contributor Covenant.  See our [code of conduct file](./CODE_OF_CONDUCT.md) for more information.

### Notes

<sup>1</sup> One of the tenets of the system is that it should be dumb - any logic required to create the view or table used should be maintained by the data steward outside of the ComplexCity system.

<sup>2</sup> Error output is in JSON. For a pretty-printed version, if the output is in errors.log, then simply run: ```bunyan errors.log ```. The ```bunyan``` command can be found in the ```node_modules/.bin/``` subdirectory of the ComplexCity source.



