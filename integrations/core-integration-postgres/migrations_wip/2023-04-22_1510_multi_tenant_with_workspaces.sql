-- Introduce the concept of workspaces and members.
/*
 Checklist:
 - [x] Add a table for workspaces and workspace_member join table
 */

--- Create tables ---
CREATE TABLE IF NOT EXISTS "public"."workspace" (
  "id" varchar NOT NULL DEFAULT concat('ws_', generate_ulid ()),
  "name" varchar NOT NULL,
  "slug" varchar NOT NULL UNIQUE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_workspace" PRIMARY KEY ("id"),
  CONSTRAINT workspace_id_prefix_check CHECK (starts_with(id, 'ws_'))
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

-- Allow supabase realtime to work
ALTER publication supabase_realtime ADD TABLE workspace, workspace_member;

-- Introduce workspace id to everything else...
ALTER TABLE "public"."integration" ADD COLUMN workspace_id varchar NOT NULL,
  ADD CONSTRAINT integration_workspace_id_fkey
  FOREIGN KEY (workspace_id)
  REFERENCES workspace(id);

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

--- User policies ---
DROP FUNCTION IF EXISTS auth.workspace_ids CASCADE;

DROP POLICY IF EXISTS workspace_member_access ON public.workspace;
CREATE POLICY workspace_member_access ON "public"."workspace" TO authenticated
  USING (id = ANY(
    select workspace_id from "workspace_member" where user_id::varchar = auth.uid()
  ))
  WITH CHECK (id = ANY(
    select workspace_id from "workspace_member" where user_id::varchar = auth.uid()
  ));

DROP POLICY IF EXISTS workspace_member_access ON public.workspace_member;
CREATE POLICY workspace_member_access ON "public"."workspace_member" TO authenticated
  USING (user_id::varchar = auth.uid())
  WITH CHECK (user_id::varchar = auth.uid());

DROP POLICY IF EXISTS workspace_member_access ON public.integration;
CREATE POLICY workspace_member_access ON "public"."integration" TO authenticated
  USING (workspace_id = ANY(
    select workspace_id from "workspace_member" where user_id::varchar = auth.uid()
  ))
  WITH CHECK (workspace_id = ANY(
    select workspace_id from "workspace_member" where user_id::varchar = auth.uid()
  ));

DROP POLICY IF EXISTS workspace_member_access ON public.resource;
CREATE POLICY workspace_member_access ON "public"."resource" TO authenticated
  USING (integration_id = ANY(
    select i.id from integration i
    join workspace_member wm on i.workspace_id = wm.workspace_id
    where wm.user_id::varchar = auth.uid()
  ))
  WITH CHECK (integration_id = ANY(
    select i.id from integration i
    join workspace_member wm on i.workspace_id = wm.workspace_id
    where wm.user_id::varchar = auth.uid()
  ));

DROP POLICY IF EXISTS workspace_member_access ON public.pipeline;
CREATE POLICY workspace_member_access ON "public"."pipeline" TO authenticated
  USING (
    array(
      select r.id
      from resource r
      join integration i on i.id = r.integration_id
      join workspace_member wm on wm.workspace_id = i.workspace_id
      where wm.user_id::varchar = auth.uid()
    ) && array[source_id, destination_id]
    -- && and @> is the same, however we are using && to stay consistent with end user policy
  )
  WITH CHECK (
    array(
      select r.id
      from resource r
      join integration i on i.id = r.integration_id
      join workspace_member wm on wm.workspace_id = i.workspace_id
      where wm.user_id::varchar = auth.uid()
    ) @> array[source_id, destination_id]
    -- User must have access to both the source & destination resources
  );


--- End user policies ---

CREATE ROLE "end_user";
GRANT "end_user" TO "postgres";
GRANT USAGE ON SCHEMA public TO "end_user";

DROP FUNCTION IF EXISTS auth.end_user_workspace_integration_ids cascade;
CREATE OR REPLACE FUNCTION auth.end_user_workspace_integration_ids()
  RETURNS TABLE (id varchar)
  LANGUAGE sql
  SECURITY DEFINER
  STABLE
AS $function$
  select id as integration_id
    from integration
    where workspace_id = current_setting('endUser.workspaceId', true)
$function$;

GRANT SELECT (id) ON public.integration TO "end_user";
DROP POLICY IF EXISTS end_user_access ON public.integration;
CREATE POLICY end_user_access ON public.integration TO end_user
  USING (workspace_id = current_setting('endUser.workspaceId', true));


GRANT SELECT, UPDATE (display_name), DELETE ON public.resource TO "end_user";
DROP POLICY IF EXISTS end_user_access ON public.resource;
CREATE POLICY end_user_access ON public.resource TO end_user
  USING (
    integration_id = ANY(select id from auth.end_user_workspace_integration_ids())
    AND end_user_id = (select current_setting('endUser.id', true))
  );

-- REVOKE DELETE ON public.pipeline FROM "end_user";
GRANT SELECT ON public.pipeline TO "end_user";
DROP POLICY IF EXISTS end_user_access ON public.pipeline;
CREATE POLICY end_user_access ON public.pipeline TO end_user
  USING ((
    select array(
      select id
        from resource
        where integration_id = ANY(select id from auth.end_user_workspace_integration_ids())
          AND end_user_id = (select current_setting('endUser.id', true))
    ) && array[source_id, destination_id]
  -- User can see any pipeline that they their resource is connected to for the moment
  ));

--- Workspace policies ---

CREATE ROLE "workspace";
GRANT "workspace" TO "postgres";
GRANT USAGE ON SCHEMA public TO "workspace";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "workspace";

DROP POLICY IF EXISTS workspace_access ON public.workspace;
CREATE POLICY workspace_access ON public.workspace TO workspace
  USING (id = current_setting('workspace.id', true))
  WITH CHECK (id = current_setting('workspace.id', true));

DROP POLICY IF EXISTS workspace_access ON public.workspace_member;
CREATE POLICY workspace_access ON public.workspace_member TO workspace
  USING (workspace_id = current_setting('workspace.id', true))
  WITH CHECK (workspace_id = current_setting('workspace.id', true));

DROP POLICY IF EXISTS workspace_access ON public.integration;
CREATE POLICY workspace_access ON public.integration TO workspace
  USING (workspace_id = current_setting('workspace.id', true))
  WITH CHECK (workspace_id = current_setting('workspace.id', true));

DROP POLICY IF EXISTS workspace_access ON public.resource;
CREATE POLICY workspace_access ON public.resource TO workspace
  USING (integration_id = ANY(
      select id from integration
      where workspace_id = current_setting('workspace.id', true)
  ))
  WITH CHECK (integration_id = ANY(
      select id from integration
      where workspace_id = current_setting('workspace.id', true)
  ));

DROP POLICY IF EXISTS workspace_access ON public.pipeline;
CREATE POLICY workspace_access ON public.pipeline TO workspace
  USING ((
    select array(
      select r.id
      from resource r
      join integration i on r.integration_id = i.id
      where i.workspace_id = current_setting('workspace.id', true)
    ) && array[source_id, destination_id]
    -- && and @> is the same, however we are using && to stay consistent with end user policy
  ))
  WITH CHECK ((
    select array(
      select r.id
      from resource r
      join integration i on r.integration_id = i.id
      where i.workspace_id = current_setting('workspace.id', true)
    ) @> array[source_id, destination_id]
    -- Pipeline must be fully within the workspace
  ));

-- FiXME: Revoke write access to institution once we figure out a better way...
-- It's not YET an issue because we are not issuing any workspace-role tokens at the moment
GRANT INSERT, UPDATE ON public.institution TO "workspace";
DROP POLICY IF EXISTS workspace_write_access ON public.institution;
CREATE POLICY workspace_write_access ON "public"."institution" FOR SELECT, INSERT, UPDATE
  USING (true) WITH CHECK (true);

-- @see https://www.postgresql.org/docs/current/sql-createpolicy.html for docs
--- Clean up previous ---

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

--- Migrating previous DATA

--  ALTER TABLE "public"."resource" ALTER COLUMN integration_id SET NOT NULL;
--  ALTER TABLE "public"."pipeline" ALTER COLUMN source_id SET NOT NULL;
--  ALTER TABLE "public"."pipeline" ALTER COLUMN destination_id SET NOT NULL;



