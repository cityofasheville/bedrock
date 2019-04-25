module.exports = `
CREATE TABLE bedrock.object_blueprint_aux_info
(
  blueprint_name character varying NOT NULL,
  name character varying NOT NULL,
  description character varying,
  type character varying NOT NULL,
  value character varying
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
`;
