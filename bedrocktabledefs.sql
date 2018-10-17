--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.8
-- Dumped by pg_dump version 10.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: bedrock; Type: SCHEMA; Schema: -; Owner: mda_admin
--

CREATE SCHEMA bedrock;


ALTER SCHEMA bedrock OWNER TO mda_admin;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: asset_depends; Type: TABLE; Schema: bedrock; Owner: mda_admin
--

CREATE TABLE bedrock.asset_depends (
    id integer NOT NULL,
    asset_id integer,
    depends character varying(255)
);


ALTER TABLE bedrock.asset_depends OWNER TO mda_admin;

--
-- Name: assets; Type: TABLE; Schema: bedrock; Owner: mda_admin
--

CREATE TABLE bedrock.assets (
    id integer NOT NULL,
    name character varying(255),
    active bit(1),
    type character varying(20),
    description character varying(1000)
);


ALTER TABLE bedrock.assets OWNER TO mda_admin;

--
-- Name: etl_tasks; Type: TABLE; Schema: bedrock; Owner: mda_admin
--

CREATE TABLE bedrock.etl_tasks (
    id integer NOT NULL,
    asset_id integer,
    task_order smallint,
    type character varying(20),
    file character varying(255),
    db character varying(63),
    active bit(1)
);


ALTER TABLE bedrock.etl_tasks OWNER TO mda_admin;

--
-- Name: mda_assetlist_depend_id_seq; Type: SEQUENCE; Schema: bedrock; Owner: mda_admin
--

CREATE SEQUENCE bedrock.mda_assetlist_depend_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bedrock.mda_assetlist_depend_id_seq OWNER TO mda_admin;

--
-- Name: mda_assetlist_depend_id_seq; Type: SEQUENCE OWNED BY; Schema: bedrock; Owner: mda_admin
--

ALTER SEQUENCE bedrock.mda_assetlist_depend_id_seq OWNED BY bedrock.asset_depends.id;


--
-- Name: mda_assetlist_id_seq; Type: SEQUENCE; Schema: bedrock; Owner: mda_admin
--

CREATE SEQUENCE bedrock.mda_assetlist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bedrock.mda_assetlist_id_seq OWNER TO mda_admin;

--
-- Name: mda_assetlist_id_seq; Type: SEQUENCE OWNED BY; Schema: bedrock; Owner: mda_admin
--

ALTER SEQUENCE bedrock.mda_assetlist_id_seq OWNED BY bedrock.assets.id;


--
-- Name: metadata; Type: TABLE; Schema: bedrock; Owner: mda_admin
--

CREATE TABLE bedrock.metadata (
    id integer NOT NULL,
    name character varying(64),
    json character varying
);


ALTER TABLE bedrock.metadata OWNER TO mda_admin;

--
-- Name: schema_columns; Type: TABLE; Schema: bedrock; Owner: mda_admin
--

CREATE TABLE bedrock.schema_columns (
    schema_name character varying(64) NOT NULL,
    column_name character varying(64) NOT NULL,
    column_length smallint,
    column_precision smallint,
    column_not_null bit(1),
    column_primary_key bit(1)
);


ALTER TABLE bedrock.schema_columns OWNER TO mda_admin;

--
-- Name: schemas; Type: TABLE; Schema: bedrock; Owner: mda_admin
--

CREATE TABLE bedrock.schemas (
    table_name character varying(64) NOT NULL,
    description character varying,
    update_date timestamp without time zone
);


ALTER TABLE bedrock.schemas OWNER TO mda_admin;

--
-- Name: view_mda_assetlist; Type: VIEW; Schema: bedrock; Owner: mda_admin
--

CREATE VIEW bedrock.view_mda_assetlist AS
 SELECT al.id,
    al.name,
    al.active,
    al.type,
    al.description,
    ald.id AS dependsid,
    ald.depends
   FROM (bedrock.assets al
     LEFT JOIN bedrock.asset_depends ald ON ((al.id = ald.asset_id)));


ALTER TABLE bedrock.view_mda_assetlist OWNER TO mda_admin;

--
-- Name: asset_depends id; Type: DEFAULT; Schema: bedrock; Owner: mda_admin
--

ALTER TABLE ONLY bedrock.asset_depends ALTER COLUMN id SET DEFAULT nextval('bedrock.mda_assetlist_depend_id_seq'::regclass);


--
-- Name: assets id; Type: DEFAULT; Schema: bedrock; Owner: mda_admin
--

ALTER TABLE ONLY bedrock.assets ALTER COLUMN id SET DEFAULT nextval('bedrock.mda_assetlist_id_seq'::regclass);


--
-- Name: assets PK_mda_assetlist; Type: CONSTRAINT; Schema: bedrock; Owner: mda_admin
--

ALTER TABLE ONLY bedrock.assets
    ADD CONSTRAINT "PK_mda_assetlist" PRIMARY KEY (id);


--
-- Name: asset_depends PK_mda_assetlist_depend; Type: CONSTRAINT; Schema: bedrock; Owner: mda_admin
--

ALTER TABLE ONLY bedrock.asset_depends
    ADD CONSTRAINT "PK_mda_assetlist_depend" PRIMARY KEY (id);


--
-- Name: etl_tasks etl_tasks_pkey; Type: CONSTRAINT; Schema: bedrock; Owner: mda_admin
--

ALTER TABLE ONLY bedrock.etl_tasks
    ADD CONSTRAINT etl_tasks_pkey PRIMARY KEY (id);


--
-- Name: schema_columns schema_columns_pkey; Type: CONSTRAINT; Schema: bedrock; Owner: mda_admin
--

ALTER TABLE ONLY bedrock.schema_columns
    ADD CONSTRAINT schema_columns_pkey PRIMARY KEY (schema_name, column_name);


--
-- Name: schemas schemas_pkey; Type: CONSTRAINT; Schema: bedrock; Owner: mda_admin
--

ALTER TABLE ONLY bedrock.schemas
    ADD CONSTRAINT schemas_pkey PRIMARY KEY (table_name);


--
-- PostgreSQL database dump complete
--

