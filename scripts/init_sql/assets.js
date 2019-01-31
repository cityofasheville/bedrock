module.exports = `

CREATE SEQUENCE bedrock.asset_id_seq
    INCREMENT 1
    START 8349
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE bedrock.assets
(
    id integer NOT NULL DEFAULT nextval('bedrock.asset_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    location integer NOT NULL,
    etl_group integer NOT NULL DEFAULT 1 references bedrock.etl_groups(id),
    active boolean NOT NULL,
    type character varying(20) COLLATE pg_catalog."default" NOT NULL,
    description character varying(1000) COLLATE pg_catalog."default",
    category character varying(255) COLLATE pg_catalog."default",
    tags character varying(255)[] COLLATE pg_catalog."default",
    schema character varying(255) COLLATE pg_catalog."default",
    title character varying(255) COLLATE pg_catalog."default",
    publication_date date,
    responsible_party character varying(255) COLLATE pg_catalog."default",
    responsible_party_role character varying(255) COLLATE pg_catalog."default",
    url character varying(255) COLLATE pg_catalog."default",
    abstract character varying(2000) COLLATE pg_catalog."default",
    status character varying(255) COLLATE pg_catalog."default",
    update_frequency character varying(255) COLLATE pg_catalog."default",
    keywords character varying(255)[] COLLATE pg_catalog."default",
    use_constraints character varying(2000) COLLATE pg_catalog."default",
    metadata_constraints character varying(255)[] COLLATE pg_catalog."default",
    resource_constraints character varying(2000) COLLATE pg_catalog."default",
    topic_category character varying(255)[] COLLATE pg_catalog."default",
    geo_extent_east double precision,
    geo_extent_west double precision,
    geo_extent_north double precision,
    geo_extent_south double precision,
    feature_catalog character varying(255) COLLATE pg_catalog."default",
    process_description character varying(255) COLLATE pg_catalog."default",
    spatial_reference character varying(255) COLLATE pg_catalog."default",
    metadata_creation_date date,
    contact_role_code character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "PK_mda_assetlist" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

CREATE UNIQUE INDEX assets_name_idx
    ON bedrock.assets USING btree
    (name COLLATE pg_catalog."default", location)
    TABLESPACE pg_default;

`;
