/* eslint-disable no-console */
const fs = require('fs');
const connectionManager = require('./db/connection_manager');

/*

Looking up indices: 
https://stackoverflow.com/questions/45983169/checking-for-existence-of-index-in-postgresql

CREATE TABLE internal.coa_bc_address_master
(
    objectid integer NOT NULL,
    civicaddress_id integer,
    address_x numeric(38,8),
    address_y numeric(38,8),
    address_full character varying(40) COLLATE pg_catalog."default",
    address_number integer,
    address_unit character varying(4) COLLATE pg_catalog."default",
    address_street_prefix character varying(2) COLLATE pg_catalog."default",
    address_street_name character varying(30) COLLATE pg_catalog."default",
    address_street_type character varying(4) COLLATE pg_catalog."default",
    address_street_postdirection character varying(2) COLLATE pg_catalog."default",
    address_city character varying(28) COLLATE pg_catalog."default",
    address_commcode character varying(4) COLLATE pg_catalog."default",
    address_zipcode integer,
    location_type integer,
    address_change_date timestamp without time zone,
    maximo_type character varying(30) COLLATE pg_catalog."default",
    maximo_seq_num integer,
    asset_code character varying(50) COLLATE pg_catalog."default",
    mrc character varying(8) COLLATE pg_catalog."default",
    water_district character varying(8) COLLATE pg_catalog."default",
    trash_pickup_day character varying(10) COLLATE pg_catalog."default",
    jurisdiction_type character varying(150) COLLATE pg_catalog."default",
    zoning character varying(200) COLLATE pg_catalog."default",
    river_district character varying(200) COLLATE pg_catalog."default",
    centerline_id numeric(19,0),
    location_id numeric(19,0),
    parent_location_id numeric(19,0),
    property_pinnum character varying(15) COLLATE pg_catalog."default",
    property_pin character varying(15) COLLATE pg_catalog."default",
    property_pinext character varying(50) COLLATE pg_catalog."default",
    property_nmptype character varying(150) COLLATE pg_catalog."default",
    property_oldpinnum character varying(50) COLLATE pg_catalog."default",
    property_update_date character varying(50) COLLATE pg_catalog."default",
    property_update_reason character varying(50) COLLATE pg_catalog."default",
    property_deeddate character varying(50) COLLATE pg_catalog."default",
    property_taxyear character varying(50) COLLATE pg_catalog."default",
    property_deedurl character varying(254) COLLATE pg_catalog."default",
    property_platurl character varying(254) COLLATE pg_catalog."default",
    property_propcardurl character varying(150) COLLATE pg_catalog."default",
    property_acreage numeric(38,8),
    property_class character varying(50) COLLATE pg_catalog."default",
    property_improved character varying(50) COLLATE pg_catalog."default",
    property_exempt character varying(50) COLLATE pg_catalog."default",
    property_priced character varying(50) COLLATE pg_catalog."default",
    property_totalmarketvalue numeric(38,2),
    property_appraisedvalue numeric(38,2),
    property_taxvalue numeric(38,2),
    property_landuse character varying(50) COLLATE pg_catalog."default",
    property_neighborhoodcode character varying(50) COLLATE pg_catalog."default",
    property_landvalue numeric(38,2),
    property_buildingvalue numeric(38,2),
    property_improvementvalue numeric(38,2),
    property_appraisalarea character varying(50) COLLATE pg_catalog."default",
    property_condounit character varying(50) COLLATE pg_catalog."default",
    property_condobuilding character varying(50) COLLATE pg_catalog."default",
    property_subname character varying(50) COLLATE pg_catalog."default",
    property_sublot character varying(50) COLLATE pg_catalog."default",
    property_subblock character varying(50) COLLATE pg_catalog."default",
    property_subsect character varying(50) COLLATE pg_catalog."default",
    property_township character varying(50) COLLATE pg_catalog."default",
    property_stamps numeric(38,8),
    property_instrument character varying(50) COLLATE pg_catalog."default",
    property_firedistrict character varying(50) COLLATE pg_catalog."default",
    property_schooldistrict character varying(50) COLLATE pg_catalog."default",
    owner_name text COLLATE pg_catalog."default",
    owner_house_number character varying(50) COLLATE pg_catalog."default",
    owner_number_suffix character varying(50) COLLATE pg_catalog."default",
    owner_direction character varying(50) COLLATE pg_catalog."default",
    owner_street_name character varying(50) COLLATE pg_catalog."default",
    owner_street_type character varying(50) COLLATE pg_catalog."default",
    owner_careof character varying(50) COLLATE pg_catalog."default",
    owner_address character varying(50) COLLATE pg_catalog."default",
    owner_cityname character varying(50) COLLATE pg_catalog."default",
    owner_state character varying(50) COLLATE pg_catalog."default",
    owner_zipcode character varying(50) COLLATE pg_catalog."default",
    owner_account_number character varying(50) COLLATE pg_catalog."default",
    longitude_wgs numeric(38,8),
    latitude_wgs numeric(38,8),
    recycling_pickup_district character varying(2) COLLATE pg_catalog."default",
    recycling_pickup_day character varying(10) COLLATE pg_catalog."default",
    gdb_geomattr_data bytea,
    unit_type integer,
    nbrhd_id character varying(10) COLLATE pg_catalog."default",
    nbrhd_name character varying(25) COLLATE pg_catalog."default",
    brushweek character varying(2) COLLATE pg_catalog."default",
    historic_district character varying(100) COLLATE pg_catalog."default",
    local_landmark character varying(50) COLLATE pg_catalog."default",
    shape geometry(Geometry,2264)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE internal.coa_bc_address_master
    OWNER to dbadmin;

GRANT ALL ON TABLE internal.coa_bc_address_master TO dbadmin;

-- Index: a23_ix1

-- DROP INDEX internal.a23_ix1;

CREATE INDEX a23_ix1
    ON internal.coa_bc_address_master USING gist
    (shape)
    TABLESPACE pg_default;

-- Index: r31_sde_rowid_uk

-- DROP INDEX internal.r31_sde_rowid_uk;

CREATE UNIQUE INDEX r31_sde_rowid_uk
    ON internal.coa_bc_address_master USING btree
    (objectid)
    WITH (FILLFACTOR=75)
    TABLESPACE pg_default;

-- Index: search

-- DROP INDEX internal.search;

CREATE INDEX search
    ON internal.coa_bc_address_master USING btree
    (address_number, address_street_name COLLATE pg_catalog."default", address_street_type COLLATE pg_catalog."default", address_street_prefix COLLATE pg_catalog."default", address_zipcode, address_commcode COLLATE pg_catalog."default", address_unit COLLATE pg_catalog."default")
    TABLESPACE pg_default;
*/
async function createObjects(args) {
  if (args.argCount() < 1) {
    console.log(`argcount is ${args.argCount()}`);
    process.exit(1);
  }
  const assetName = args.getArg(0);
  const startDir = args.getOption('start', '.');
  const path = `${startDir}/${assetName}/mda.json`;

  if (!fs.existsSync(path)) {
    console.error(`Asset ${assetName} not found`);
    process.exit(1);
  }
  const mdafd = fs.openSync(`${path}`, 'r');
  const mda = JSON.parse(fs.readFileSync(mdafd, { encoding: 'utf8' }));
  if (!mda.objects || mda.objects.length === 0) {
    console.log(`No objects found for asset ${assetName}`);
    process.exit(1);
  }
  const tClient = connectionManager.getConnection('mdastore1');

  console.log(`Create the objects for ${assetName}`);
  for (let i = 0; i < mda.objects.length; i += 1) {
    const obj = mda.objects[i];
    console.log(`Do object ${JSON.stringify(obj, null, 2)}`);
    if (obj.type === 'table') {
      const objName = `${obj.schema}.${obj.name}`;
      const existsQuery = `SELECT EXISTS (
        SELECT * FROM information_schema.tables
        WHERE table_schema = '${obj.schema}' AND table_name = '${obj.name}'
        )`;
      if (obj.blueprint) {
        const result = await tClient.query(existsQuery);
        if (!result.rows || result.rows.length <= 0) {
          throw new Error(`Error querying whether table ${objName} exists`);
        }
        if (false && result.rows[0].exists) {
          console.log(`Table ${objName} already exists - aborting`);
          process.exit(0);
        }
        const bClient = connectionManager.getConnection('bedrock');
        const blueprintQuery = `SELECT * FROM bedrock.object_blueprint_columns
          WHERE blueprint_name = '${obj.blueprint}'`;
        const colResult = await bClient.query(blueprintQuery);
        if (!result.rows || result.rows.length <= 0) {
          throw new Error(`Error querying columns for blueprint ${obj.blueprint}`);
        }
        const columns = colResult.rows;
        console.log(JSON.stringify(columns, null, 2));
      } else {
        console.log(`No blueprint specified for object ${objName}`);
      }
      /*
        1. Look up the blueprint
      */
    }
  }
}

module.exports = createObjects;
