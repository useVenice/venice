-- Introduce the concept of workspaces and members.
/*
 Checklist:
 - [x] Add a table for workspaces and workspace_member join table
 */

-- Create tables
CREATE TABLE IF NOT EXISTS "public"."workspace" (
  "id" varchar NOT NULL DEFAULT concat('ws_', generate_ulid ()),
  "name" varchar NOT NULL,
  "slug" varchar NOT NULL UNIQUE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_workspace" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS workspace_created_at ON workspace (created_at);
CREATE INDEX IF NOT EXISTS workspace_updated_at ON workspace (updated_at);

ALTER TABLE "public"."workspace" ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS "public"."workspace_member" (
  "workspace_id" varchar NOT NULL,
  "user_id" uuid NOT NULL, -- To support supabase auth...
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_workspace_member" PRIMARY KEY ("workspace_id", "user_id"),
  FOREIGN KEY (workspace_id) REFERENCES workspace (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS workspace_member_created_at ON workspace_member (created_at);
CREATE INDEX IF NOT EXISTS workspace_member_updated_at ON workspace_member (updated_at);

ALTER TABLE "public"."workspace_member" ENABLE ROW LEVEL SECURITY;

-- Create policies on workspace and workspace_members

CREATE OR REPLACE FUNCTION auth.workspace_ids()
 RETURNS varchar[]
 LANGUAGE sql
 STABLE
AS $function$
  select array(select workspace_id from "workspace_member" where user_id::varchar = auth.uid())
$function$;

DROP POLICY IF EXISTS workspace_member_access ON public.workspace_member;
CREATE POLICY workspace_member_access ON "public"."workspace_member"
  USING (user_id::varchar = auth.uid())
  WITH CHECK (user_id::varchar = auth.uid());

DROP POLICY IF EXISTS workspace_member_access ON public.workspace;
CREATE POLICY workspace_member_access ON "public"."workspace"
  USING ((
    with cached as MATERIALIZED(select auth.workspace_ids())
    select id = ANY(workspace_ids) from cached
  ))
  WITH CHECK ((
    with cached as MATERIALIZED(select auth.workspace_ids())
    select id = ANY(workspace_ids) from cached
  ));

-- Introduce workspace id to everything else...
ALTER TABLE "public"."integration" ADD COLUMN workspace_id varchar,
  ADD CONSTRAINT integration_workspace_id_fkey
  FOREIGN KEY (workspace_id)
  REFERENCES workspace(id);

CREATE POLICY workspace_member_access ON "public"."integration"
  USING ((
    with cached as MATERIALIZED(select auth.workspace_ids())
    select workspace_id = ANY(workspace_ids) from cached
  ))
  WITH CHECK ((
    with cached as MATERIALIZED(select auth.workspace_ids())
    select workspace_id = ANY(workspace_ids) from cached
  ));

DROP POLICY IF EXISTS workspace_member_access ON public.resource;
CREATE POLICY workspace_member_access ON "public"."resource"
  USING ((
    with cached as MATERIALIZED(
      select id as integration_id
      from integration
      where workspace_id = ANY(auth.workspace_ids())
    )
    select integration_id = ANY(select integration_id from cached)
  ))
  WITH CHECK ((
    with cached as MATERIALIZED(
      select id as integration_id
      from integration
      where workspace_id = ANY(auth.workspace_ids())
    )
    select integration_id = ANY(select integration_id from cached)
  ));

DROP POLICY IF EXISTS workspace_member_access ON public.pipeline;
CREATE POLICY workspace_member_access ON "public"."pipeline"
  USING ((
    with cached as MATERIALIZED(
      select r.id as resource_id
      from resource r
      join integration i on i.id = r.integration_id
      where i.workspace_id = ANY(auth.workspace_ids())
    )
    -- Prevent user from seeing pipelines that don't have a source or destination that they have access to
    select array(select resource_id from cached) @> array[source_id, destination_id]
  ))
  WITH CHECK ((
    with cached as MATERIALIZED(
      select r.id as resource_id
      from resource r
      join integration i on i.id = r.integration_id
      where i.workspace_id = ANY(auth.workspace_ids())
    )
    -- Prevent user from creating/updating pipelines that don't have a source or destination that they have access to
    select array(select resource_id from cached) @> array[source_id, destination_id]
  ));


-- Not sure if we need this either because pipelines source and destination are tied to integration which are tied to workspace also
-- So we don't technically need it for RLS, so let's wait to add it for now...
-- ALTER TABLE "public"."pipeline" ADD COLUMN workspace_id varchar,
--   ADD CONSTRAINT pipeline_workspace_id_fkey
--   FOREIGN KEY (workspace_id)
--   REFERENCES workspace(id);

-- Not clear if we need this at all, as resource is one-to-one with integration which is tied to workspace
-- ALTER TABLE "public"."resource" ADD COLUMN workspace_id varchar,
--   ADD CONSTRAINT resource_workspace_id_fkey
--   FOREIGN KEY (workspace_id)
--   REFERENCES workspace(id);

DROP POLICY IF EXISTS admin_access ON raw_transaction;
DROP POLICY IF EXISTS admin_access ON raw_commodity;
DROP POLICY IF EXISTS admin_access ON raw_account;
DROP POLICY IF EXISTS admin_access ON institution;
DROP POLICY IF EXISTS admin_access ON integration;
DROP POLICY IF EXISTS admin_access ON resource;
DROP POLICY IF EXISTS admin_access ON pipeline;
DROP POLICY IF EXISTS admin_access ON migrations;

DROP FUNCTION IF EXISTS auth.is_admin;
DROP PROCEDURE IF EXISTS auth.set_user_admin;
