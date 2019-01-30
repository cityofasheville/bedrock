module.exports = `
CREATE TABLE bedrock.object_blueprint_columns
(
  blueprint_name character varying COLLATE pg_catalog."default" NOT NULL,
  column_name information_schema.sql_identifier COLLATE pg_catalog."default",
  ordinal_position information_schema.cardinal_number,
  column_default information_schema.character_data COLLATE pg_catalog."default",
  is_nullable information_schema.yes_or_no COLLATE pg_catalog."default",
  data_type information_schema.character_data COLLATE pg_catalog."default",
  character_maximum_length information_schema.cardinal_number,
  numeric_precision information_schema.cardinal_number,
  numeric_precision_radix information_schema.cardinal_number,
  numeric_scale information_schema.cardinal_number,
  datetime_precision information_schema.cardinal_number,
  interval_type information_schema.character_data COLLATE pg_catalog."default",
  interval_precision information_schema.cardinal_number
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
`;
