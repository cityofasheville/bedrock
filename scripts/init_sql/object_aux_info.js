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
`;
