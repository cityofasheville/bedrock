module.exports = `
CREATE SEQUENCE bedrock.asset_location_id_seq
    INCREMENT 1
    START 5
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

    
CREATE TABLE bedrock.asset_locations
(
    id integer NOT NULL DEFAULT nextval('bedrock.asset_location_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default",
    short_name character varying(255) COLLATE pg_catalog."default",
    active boolean,
    type character varying(100) COLLATE pg_catalog."default",
    description character varying(1000) COLLATE pg_catalog."default",
    CONSTRAINT "PK_mda_location_list" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

`;
