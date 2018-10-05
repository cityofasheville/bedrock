#!/usr/bin/bash

# start in C:/coa/complexcitycoa

node C:/coa/complexcity/scripts/traverse_and_do_task.js etl --start=C:/coa/managed-data-assets/everbridge --dest=C:/coa/etl_jobs_dir --logfile=C:/coa/etl_jobs_dir/joblog.log

# node C:/coa/complexcitycoa/scripts/run_etl_jobs.js --logfile=C:/coa/etl_jobs_dir/etl.log C:/coa/etl_jobs_dir
