
-- Drop table

-- DROP TABLE bedrock.asset_depends;

CREATE TABLE bedrock.asset_depends (
	id serial NOT NULL,
	asset_id int4 NULL,
	"depends" varchar(255) NULL,
	CONSTRAINT "PK_asset_depend" PRIMARY KEY (id),
	CONSTRAINT "UK_asset_depends_assetid_depends" UNIQUE (asset_id, depends)
);

-- Drop table

-- DROP TABLE bedrock.asset_locations;

CREATE TABLE bedrock.asset_locations (
	id serial NOT NULL,
	"name" varchar(255) NULL,
	short_name varchar(255) NULL,
	active bool NULL,
	"type" varchar(100) NULL,
	description varchar(1000) NULL,
	CONSTRAINT "PK_mda_location_list" PRIMARY KEY (id)
);

-- Drop table

-- DROP TABLE bedrock.etl_tasks;

CREATE TABLE bedrock.etl_tasks (
	id serial NOT NULL,
	asset_id int4 NULL,
	task_order int2 NULL,
	from_loc_id int4 NULL,
	from_table text NULL,
	to_loc_id int4 NULL,
	to_table text NULL,
	active bool NULL,
	CONSTRAINT "IX_asset_ordinal" UNIQUE (asset_id, task_order),
	CONSTRAINT etl_tasks_pkey PRIMARY KEY (id)
);

-- Drop table

-- DROP TABLE bedrock.assets;

CREATE TABLE bedrock.assets (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" int4 NOT NULL,
	etl_group int4 NOT NULL DEFAULT 1,
	active bool NOT NULL,
	"type" varchar(20) NOT NULL,
	description varchar(1000) NULL,
	category varchar(255) NULL,
	tags varchar[] NULL,
	"schema" varchar(255) NULL,
	title varchar(255) NULL,
	publication_date date NULL,
	responsible_party varchar(255) NULL,
	responsible_party_role varchar(255) NULL,
	url varchar(255) NULL,
	abstract varchar(2000) NULL,
	status varchar(255) NULL,
	update_frequency varchar(255) NULL,
	keywords varchar[] NULL,
	use_constraints varchar(2000) NULL,
	metadata_constraints varchar[] NULL,
	resource_constraints varchar(2000) NULL,
	topic_category varchar[] NULL,
	geo_extent_east float8 NULL,
	geo_extent_west float8 NULL,
	geo_extent_north float8 NULL,
	geo_extent_south float8 NULL,
	feature_catalog varchar(255) NULL,
	process_description varchar(255) NULL,
	spatial_reference varchar(255) NULL,
	metadata_creation_date date NULL,
	contact_role_code varchar(255) NULL,
	CONSTRAINT "PK_mda_assetlist" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX assets_name_idx ON bedrock.assets USING btree (name, location);

