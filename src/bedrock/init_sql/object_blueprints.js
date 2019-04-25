module.exports = `
CREATE TABLE bedrock.object_blueprints
(
    name character varying COLLATE pg_catalog."default" NOT NULL UNIQUE,
    description character varying COLLATE pg_catalog."default",
    update_date timestamp without time zone,
    CONSTRAINT schemas_pkey PRIMARY KEY (name)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
`;
