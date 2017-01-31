# Processing Scripts

There are two key scripts.

````Metarun.js [options] command_name```` walks the hierarchy of dataset directories. When if finds a directory associatedwith a managed data asset (indicated by the existence of a ````dataset.json```` file), it calls a script specified by ````command_name````. Commands currently include:

* __validate__ - validates that the data described in the ````dataset.json```` file matches the tables used for input and output <sup>1</sup>.
* __etl__ - creates a schedule of (and, soon, parameter files for) ETL jobs based on dependencies between datasets. The output is a job file used the ```jobrun.js```

### Notes

<sup>1</sup> One of the tenets of the system is that it should be dumb - any logic required to create the view or table used should be maintained by the data steward outside of the ComplexCity system.
