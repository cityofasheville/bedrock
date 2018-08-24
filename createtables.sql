DROP TABLE mda_assetlist;

CREATE TABLE mda_assetlist
(
  id serial NOT NULL,
  name character varying(255),
  active bit(1),
  type character varying(20),
  description character varying(1000),
  CONSTRAINT "PK_mda_assetlist" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mda_assetlist
  OWNER TO coagis;




CREATE TABLE mda_assetlist_depend
(
  id serial NOT NULL,
  assetlist_id integer,
  depends character varying(255),
  CONSTRAINT "PK_mda_assetlist_depend" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mda_assetlist_depend
  OWNER TO coagis;

CREATE VIEW view_mda_assetlist AS
SELECT al.id, al.name, al.active, al.type, al.description, ald.id AS dependsid, ald.depends 
FROM mda_assetlist al
LEFT JOIN mda_assetlist_depend ald
ON al.id = ald.assetlist_id;  