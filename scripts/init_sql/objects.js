module.exports = `

CREATE SEQUENCE bedrock.asset_object_id_seq
    INCREMENT 1
    START 10
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE bedrock.asset_objects
(
  id integer NOT NULL DEFAULT nextval('bedrock.asset_object_id_seq'::regclass),
  name character varying(255) COLLATE pg_catalog."default" NOT NULL,
  schema character varying(255) COLLATE pg_catalog."default",
  type character varying(20) COLLATE pg_catalog."default" NOT NULL,
  asset_id integer,
  definition_id integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

CREATE UNIQUE INDEX objects_name_idx
    ON bedrock.asset_objects USING btree
    (name COLLATE pg_catalog."default", asset_id)
    TABLESPACE pg_default;

`;
