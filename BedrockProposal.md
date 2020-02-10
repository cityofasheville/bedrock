# Bedrock

Gut current program, retaining dependency graph, metadata, blueprints, and result emails.
New core of program will not use FME, so will have different db structure for the steps. 

## Type of Task

- **COPY**
  * Data: source_location, target_location, tablename.
  * Straight copy to identical table. If table does not exist, create it. (You can also create a view at source and use that.)
- **COPY SINCE**
  * Data: source_location, target_location, tablename, date or key field, last success.
  * Copies the latest data to identical table.
- **SQL**
  * Data: location, SQL
  * Used for transformations after copy.
- **SFTP**
  * Data: host, user, password, keyfile, source_filepath, target_filepath
  * Some SFTP jobs are just moving files, others are interpreting the data files, so this is just the read/write part.

## Type of location
SQL Server
Postgres
CSV File
Fixed-width file (eg APC data)
Google Sheet
Spawn Node script?
email?

## Schedules
Run at different times: daily/weekly 

## Transactions
Old table should remain intact if copy fails.

## Rerun
Need to be able to rerun a single failed job.
