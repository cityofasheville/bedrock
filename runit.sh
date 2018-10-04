#!/usr/bin/bash

# start in C:/coa/complexcity

# node C:/coa/complexcity/scripts/traverse_and_do_task.js etl --start=C:/coa/test-managed-data-assets --dest=C:/coa/etl_jobs_dir --logfile=C:/coa/etl_jobs_dir/joblog.log

node C:/coa/complexcity/scripts/run_etl_jobs.js --logfile=C:/coa/etl_jobs_dir/etl.log C:/coa/etl_jobs_dir