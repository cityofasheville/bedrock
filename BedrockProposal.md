# Bedrock proposed changes

- Replace core of program, retaining dependency graph, metadata, blueprints, and result emails.
- New version will not use FME.
- New config interface?

## Assets
An asset is the final location of data after running one or more related tasks. Metadata applies to this version.
A typical series of tasks would be to copy a table from a source to an identical staging table on the target, and then running sql to transform it into a canonical form.

## Type of Task

- **COPY**
  * Data: source_location, target_location, tablename.
  * Straight copy to identical table. If table does not exist, create it. (You can also create a view at source and use that.)
- **COPY SINCE**
  * Data: source_location, target_location, tablename, date or key field, last success.
  * Copies the latest data to identical table.
- **SQL**
  * Data: location, SQL
  * Used for transformations after copy. DELETE FROM ... INSERT INTO ... SELECT FROM ...
- **SFTP**
  * Data: host, user, password, keyfile, source_filepath, target_filepath
  * Some SFTP jobs are just moving files, others are interpreting the data files, so this is just the read/write part.

## Type of location
- SQL Server
- Postgres
- CSV File
- Fixed-width file (eg APC data)
- API (eg Swiftly)
- Google Sheet
- Spawn Node script?
- email?

## Schedules
Run at different times: daily/weekly 

## Transactions
Old table should remain intact if copy fails.

## Rerun
Need to be able to rerun a single failed job.

## Snapshots
## Providence
## Copy since by year...

## TODO
Move job status out of files and into db

