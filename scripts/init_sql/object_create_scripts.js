module.exports = `
CREATE TABLE bedrock.asset_object_create_scripts
(
    asset_object_id integer,
    type character varying(20) COLLATE pg_catalog."default",
    script text COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
`;
