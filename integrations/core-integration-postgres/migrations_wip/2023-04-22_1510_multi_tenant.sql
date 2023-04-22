-- Introduce the concept of workspaces and members.
/*
 Checklist:
 - [x] Add a table for workspaces and workspace_member join table
 - [ ] Should we add workspace_id to entities? Better for performance but introduces normalization issues
 - [ ] Update RLS accordingly
 - [ ] No more default integrations from env vars... waste of time
 - [ ] Remove extraneous postgres resources
 - [ ] Maybe add end user id to pipeline
 */

-- Create tables

CREATE TABLE IF NOT EXISTS "public"."workspace" (
  "id" varchar NOT NULL DEFAULT concat('ws_', generate_ulid ()),
  "name" varchar NOT NULL,
  "slug" varchar NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_workspace" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS workspace_created_at ON workspace (created_at);
CREATE INDEX IF NOT EXISTS workspace_updated_at ON workspace (updated_at);
CREATE INDEX IF NOT EXISTS workspace_slug ON workspace (slug);

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

-- Create policies

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
