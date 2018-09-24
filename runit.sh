#!/usr/bin/bash

# start in C:/jon/complexcityjon

# node C:/jon/complexcityjon/scripts/traverse_and_do_task.js etl --start=C:/jon/test-managed-data-assets --dest=C:/jon/etl_jobs_dir --logfile=C:/jon/etl_jobs_dir/joblog.log

node C:/jon/complexcityjon/scripts/run_etl_jobs.js --logfile=C:/jon/etl_jobs_dir/etl.log C:/jon/etl_jobs_dir