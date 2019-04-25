module.exports = `
CREATE SEQUENCE bedrock.etl_group_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

    CREATE TABLE bedrock.etl_groups
    (
        id integer NOT NULL DEFAULT nextval('bedrock.etl_group_id_seq'::regclass),
        name character varying(255) COLLATE pg_catalog."default" NOT NULL UNIQUE,
        platform character varying(255) COLLATE pg_catalog."default",
        frequency character varying(63) COLLATE pg_catalog."default",
        CONSTRAINT etl_groups_pkey PRIMARY KEY (id)
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    INSERT INTO bedrock.etl_groups (name, platform, frequency) VALUES ('default', 'windows', 'daily');

`;
