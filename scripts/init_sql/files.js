module.exports = `
CREATE SEQUENCE bedrock.asset_files_id_seq
    INCREMENT 1
    START 82
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

    CREATE TABLE bedrock.asset_files
    (
        id integer NOT NULL DEFAULT nextval('bedrock.asset_files_id_seq'::regclass),
        asset_id integer NOT NULL,
        type character varying(255) COLLATE pg_catalog."default",
        file character varying(255) COLLATE pg_catalog."default",
        file_content text COLLATE pg_catalog."default",
        CONSTRAINT "PK_bedrock_asset_files" PRIMARY KEY (id)
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;
`;
