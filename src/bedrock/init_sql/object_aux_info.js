module.exports = `
CREATE TABLE bedrock.asset_object_aux_info
(
    asset_object_id integer,
    name character varying NOT NULL,
    description character varying,
    type character varying NOT NULL,
    subtype character varying,
    value text
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

CREATE UNIQUE INDEX object_aux_name_idx
    ON bedrock.asset_object_aux_info USING btree
    (name COLLATE pg_catalog."default", asset_object_id)
    TABLESPACE pg_default;

`;
