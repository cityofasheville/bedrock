# Notes

## Getting dependencies of a view or table

### SQLServer 
This pretty straightforward for SQLserver:

USE [AccelaProd]
GO  
SELECT * FROM sys.sql_expression_dependencies  
WHERE referencing_id = OBJECT_ID(N'avl.v_mda_Permits');   
GO 

### PostgreSQL

It's a lot nastier here. First, to get the object id of a table:

````
select 'coagis.bc_address'::regclass::oid;
````
From the wiki (https://wiki.postgresql.org/wiki/Pg_depend_display):

````
SELECT classid::regclass AS "depender object class",
    CASE classid
        WHEN 'pg_class'::regclass THEN objid::regclass::text
        WHEN 'pg_type'::regclass THEN objid::regtype::text
        WHEN 'pg_proc'::regclass THEN objid::regprocedure::text
        ELSE objid::text 
    END AS "depender object identity",
    objsubid,
    refclassid::regclass AS "referenced object class",
    CASE refclassid
        WHEN 'pg_class'::regclass THEN refobjid::regclass::text
        WHEN 'pg_type'::regclass THEN refobjid::regtype::text
        WHEN 'pg_proc'::regclass THEN refobjid::regprocedure::text
        ELSE refobjid::text
    END AS "referenced object identity",
    refobjsubid,
    CASE deptype
        WHEN 'p' THEN 'pinned'
        WHEN 'i' THEN 'internal'
        WHEN 'a' THEN 'automatic'
        WHEN 'n' THEN 'normal'
    END AS "dependency type"
FROM pg_catalog.pg_depend ;
If you are interested only in dependencies on user objects only (not system objects), add
WHERE objid >= 16384 OR refobjid >= 16384 (using the select above);
````

Here's the documentation on the pg_depend catalog: https://www.postgresql.org/docs/9.1/static/catalog-pg-depend.html.

Not sure if it's relevant, but here's another solution: http://mwenus.blogspot.com/2014/04/db-view-dependencies-in-postgresql.html
