--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Homebrew)
-- Dumped by pg_dump version 15.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: generate_ulid(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_ulid() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  -- Crockford's Base32
  encoding   BYTEA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  timestamp  BYTEA = E'\\000\\000\\000\\000\\000\\000';
  output     TEXT = '';

  unix_time  BIGINT;
  ulid       BYTEA;
BEGIN
  -- 6 timestamp bytes
  unix_time = (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;
  timestamp = SET_BYTE(timestamp, 0, (unix_time >> 40)::BIT(8)::INTEGER);
  timestamp = SET_BYTE(timestamp, 1, (unix_time >> 32)::BIT(8)::INTEGER);
  timestamp = SET_BYTE(timestamp, 2, (unix_time >> 24)::BIT(8)::INTEGER);
  timestamp = SET_BYTE(timestamp, 3, (unix_time >> 16)::BIT(8)::INTEGER);
  timestamp = SET_BYTE(timestamp, 4, (unix_time >> 8)::BIT(8)::INTEGER);
  timestamp = SET_BYTE(timestamp, 5, unix_time::BIT(8)::INTEGER);

  -- 10 entropy bytes
  ulid = timestamp || gen_random_bytes(10);

  -- Encode the timestamp
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 0) & 224) >> 5));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 0) & 31)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 1) & 248) >> 3));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 1) & 7) << 2) | ((GET_BYTE(ulid, 2) & 192) >> 6)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 2) & 62) >> 1));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 2) & 1) << 4) | ((GET_BYTE(ulid, 3) & 240) >> 4)));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 3) & 15) << 1) | ((GET_BYTE(ulid, 4) & 128) >> 7)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 4) & 124) >> 2));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 4) & 3) << 3) | ((GET_BYTE(ulid, 5) & 224) >> 5)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 5) & 31)));

  -- Encode the entropy
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 6) & 248) >> 3));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 6) & 7) << 2) | ((GET_BYTE(ulid, 7) & 192) >> 6)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 7) & 62) >> 1));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 7) & 1) << 4) | ((GET_BYTE(ulid, 8) & 240) >> 4)));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 8) & 15) << 1) | ((GET_BYTE(ulid, 9) & 128) >> 7)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 9) & 124) >> 2));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 9) & 3) << 3) | ((GET_BYTE(ulid, 10) & 224) >> 5)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 10) & 31)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 11) & 248) >> 3));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 11) & 7) << 2) | ((GET_BYTE(ulid, 12) & 192) >> 6)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 12) & 62) >> 1));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 12) & 1) << 4) | ((GET_BYTE(ulid, 13) & 240) >> 4)));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 13) & 15) << 1) | ((GET_BYTE(ulid, 14) & 128) >> 7)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 14) & 124) >> 2));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(ulid, 14) & 3) << 3) | ((GET_BYTE(ulid, 15) & 224) >> 5)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(ulid, 15) & 31)));

  RETURN output;
END
$$;


--
-- Name: jwt_end_user_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.jwt_end_user_id() RETURNS character varying
    LANGUAGE sql STABLE
    AS $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.end_user_id', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'end_user_id')
  )
$$;


--
-- Name: jwt_org_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.jwt_org_id() RETURNS character varying
    LANGUAGE sql STABLE
    AS $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.org_id', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'org_id')
  )
$$;


--
-- Name: jwt_sub(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.jwt_sub() RETURNS character varying
    LANGUAGE sql STABLE
    AS $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: institution; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.institution (
    id character varying DEFAULT concat('ins_', public.generate_ulid()) NOT NULL,
    provider_name character varying GENERATED ALWAYS AS (split_part((id)::text, '_'::text, 2)) STORED NOT NULL,
    standard jsonb DEFAULT '{}'::jsonb NOT NULL,
    external jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT institution_id_prefix_check CHECK (starts_with((id)::text, 'ins_'::text))
);


--
-- Name: integration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.integration (
    id character varying DEFAULT concat('int_', public.generate_ulid()) NOT NULL,
    provider_name character varying GENERATED ALWAYS AS (split_part((id)::text, '_'::text, 2)) STORED NOT NULL,
    config jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    org_id character varying NOT NULL,
    display_name character varying,
    end_user_access boolean,
    CONSTRAINT integration_id_prefix_check CHECK (starts_with((id)::text, 'int_'::text))
);


--
-- Name: pipeline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pipeline (
    id character varying DEFAULT concat('pipe_', public.generate_ulid()) NOT NULL,
    source_id character varying,
    source_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    destination_id character varying,
    destination_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    link_options jsonb DEFAULT '[]'::jsonb NOT NULL,
    last_sync_started_at timestamp with time zone,
    last_sync_completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT pipeline_id_prefix_check CHECK (starts_with((id)::text, 'pipe_'::text))
);


--
-- Name: resource; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource (
    id character varying DEFAULT concat('reso', public.generate_ulid()) NOT NULL,
    provider_name character varying GENERATED ALWAYS AS (split_part((id)::text, '_'::text, 2)) STORED NOT NULL,
    end_user_id character varying,
    integration_id character varying,
    institution_id character varying,
    env_name character varying,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    display_name character varying,
    CONSTRAINT resource_id_prefix_check CHECK (starts_with((id)::text, 'reso'::text))
);


--
-- Name: institution pk_institution; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.institution
    ADD CONSTRAINT pk_institution PRIMARY KEY (id);


--
-- Name: integration pk_integration; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integration
    ADD CONSTRAINT pk_integration PRIMARY KEY (id);


--
-- Name: pipeline pk_pipeline; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pipeline
    ADD CONSTRAINT pk_pipeline PRIMARY KEY (id);


--
-- Name: resource pk_resource; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource
    ADD CONSTRAINT pk_resource PRIMARY KEY (id);


--
-- Name: institution_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX institution_created_at ON public.institution USING btree (created_at);


--
-- Name: institution_provider_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX institution_provider_name ON public.institution USING btree (provider_name);


--
-- Name: institution_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX institution_updated_at ON public.institution USING btree (updated_at);


--
-- Name: integration_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX integration_created_at ON public.integration USING btree (created_at);


--
-- Name: integration_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX integration_org_id ON public.integration USING btree (org_id);


--
-- Name: integration_provider_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX integration_provider_name ON public.integration USING btree (provider_name);


--
-- Name: integration_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX integration_updated_at ON public.integration USING btree (updated_at);


--
-- Name: pipeline_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pipeline_created_at ON public.pipeline USING btree (created_at);


--
-- Name: pipeline_destination_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pipeline_destination_id ON public.pipeline USING btree (destination_id);


--
-- Name: pipeline_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pipeline_source_id ON public.pipeline USING btree (source_id);


--
-- Name: pipeline_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pipeline_updated_at ON public.pipeline USING btree (updated_at);


--
-- Name: resource_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resource_created_at ON public.resource USING btree (created_at);


--
-- Name: resource_end_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resource_end_user_id ON public.resource USING btree (end_user_id);


--
-- Name: resource_provider_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resource_provider_name ON public.resource USING btree (provider_name);


--
-- Name: resource_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resource_updated_at ON public.resource USING btree (updated_at);


--
-- Name: pipeline fk_destination_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pipeline
    ADD CONSTRAINT fk_destination_id FOREIGN KEY (destination_id) REFERENCES public.resource(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CONSTRAINT fk_destination_id ON pipeline; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT fk_destination_id ON public.pipeline IS '@graphql({"foreign_name": "destination", "local_name": "destinationOfPipelines"})';


--
-- Name: resource fk_institution_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource
    ADD CONSTRAINT fk_institution_id FOREIGN KEY (institution_id) REFERENCES public.institution(id) ON DELETE RESTRICT;


--
-- Name: resource fk_integration_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource
    ADD CONSTRAINT fk_integration_id FOREIGN KEY (integration_id) REFERENCES public.integration(id) ON DELETE RESTRICT;


--
-- Name: pipeline fk_source_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pipeline
    ADD CONSTRAINT fk_source_id FOREIGN KEY (source_id) REFERENCES public.resource(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CONSTRAINT fk_source_id ON pipeline; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT fk_source_id ON public.pipeline IS '@graphql({"foreign_name": "source", "local_name": "sourceOfPipelines"})';


--
-- Name: institution; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.institution ENABLE ROW LEVEL SECURITY;

--
-- Name: integration; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.integration ENABLE ROW LEVEL SECURITY;

--
-- Name: integration org_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_access ON public.integration TO org USING (((org_id)::text = (public.jwt_org_id())::text)) WITH CHECK (((org_id)::text = (public.jwt_org_id())::text));


--
-- Name: pipeline org_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_access ON public.pipeline TO org USING (( SELECT (ARRAY( SELECT r.id
           FROM (public.resource r
             JOIN public.integration i ON (((r.integration_id)::text = (i.id)::text)))
          WHERE ((i.org_id)::text = (public.jwt_org_id())::text)) && ARRAY[pipeline.source_id, pipeline.destination_id]))) WITH CHECK (( SELECT (ARRAY( SELECT r.id
           FROM (public.resource r
             JOIN public.integration i ON (((r.integration_id)::text = (i.id)::text)))
          WHERE ((i.org_id)::text = (public.jwt_org_id())::text)) @> ARRAY[pipeline.source_id, pipeline.destination_id])));


--
-- Name: resource org_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_access ON public.resource TO org USING (((integration_id)::text IN ( SELECT integration.id
   FROM public.integration
  WHERE ((integration.org_id)::text = (public.jwt_org_id())::text)))) WITH CHECK (((integration_id)::text IN ( SELECT integration.id
   FROM public.integration
  WHERE ((integration.org_id)::text = (public.jwt_org_id())::text))));


--
-- Name: integration org_member_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_member_access ON public.integration TO authenticated USING (((org_id)::text = (public.jwt_org_id())::text)) WITH CHECK (((org_id)::text = (public.jwt_org_id())::text));


--
-- Name: pipeline org_member_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_member_access ON public.pipeline TO authenticated USING ((ARRAY( SELECT r.id
   FROM (public.resource r
     JOIN public.integration i ON (((i.id)::text = (r.integration_id)::text)))
  WHERE ((i.org_id)::text = (public.jwt_org_id())::text)) && ARRAY[source_id, destination_id])) WITH CHECK ((ARRAY( SELECT r.id
   FROM (public.resource r
     JOIN public.integration i ON (((i.id)::text = (r.integration_id)::text)))
  WHERE ((i.org_id)::text = (public.jwt_org_id())::text)) @> ARRAY[source_id, destination_id]));


--
-- Name: resource org_member_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_member_access ON public.resource TO authenticated USING (((integration_id)::text IN ( SELECT integration.id
   FROM public.integration
  WHERE ((integration.org_id)::text = (public.jwt_org_id())::text)))) WITH CHECK (((integration_id)::text IN ( SELECT integration.id
   FROM public.integration
  WHERE ((integration.org_id)::text = (public.jwt_org_id())::text))));


--
-- Name: institution org_write_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_write_access ON public.institution USING (true) WITH CHECK (true);


--
-- Name: pipeline; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pipeline ENABLE ROW LEVEL SECURITY;

--
-- Name: institution public_readonly_access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY public_readonly_access ON public.institution FOR SELECT USING (true);


--
-- Name: resource; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.resource ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA public TO org;


--
-- Name: TABLE institution; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.institution TO org;


--
-- Name: TABLE integration; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.integration TO org;


--
-- Name: TABLE pipeline; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pipeline TO org;


--
-- Name: TABLE resource; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.resource TO org;


--
-- PostgreSQL database dump complete
--

