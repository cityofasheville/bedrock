module.exports = `
CREATE SEQUENCE bedrock.asset_depend_id_seq
    INCREMENT 1
    START 2507
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

    
CREATE TABLE bedrock.asset_depends
(
    id integer NOT NULL DEFAULT nextval('bedrock.asset_depend_id_seq'::regclass),
    asset_id integer,
    depends character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "PK_asset_depend" PRIMARY KEY (id),
    CONSTRAINT "UK_asset_depends_assetid_depends" UNIQUE (asset_id, depends)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

`;
