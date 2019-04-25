module.exports = `
CREATE SEQUENCE bedrock.etl_task_id_seq
    INCREMENT 1
    START 8804
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

    CREATE TABLE bedrock.etl_tasks
    (
        id integer NOT NULL DEFAULT nextval('bedrock.etl_task_id_seq'::regclass),
        asset_id integer,
        task_order smallint,
        category character varying(20) COLLATE pg_catalog."default",
        type character varying(20) COLLATE pg_catalog."default",
        file character varying(255) COLLATE pg_catalog."default",
        file_content text COLLATE pg_catalog."default",
        db character varying(63) COLLATE pg_catalog."default",
        active boolean,
        CONSTRAINT etl_tasks_pkey PRIMARY KEY (id),
        CONSTRAINT "IX_asset_ordinal" UNIQUE (asset_id, task_order)
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;
`;
