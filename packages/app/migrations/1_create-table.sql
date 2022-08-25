-- TODO: Consider using https://salsita.github.io/node-pg-migrate/#/migrations
-- to reduce the tons of duplication

-- Meta (Deprecated)

CREATE TABLE IF NOT EXISTS "public"."meta" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "data" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_meta" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS meta_created_at ON meta (created_at);
CREATE INDEX IF NOT EXISTS meta_updated_at ON meta (updated_at);

--
-- App
--

-- Only used on local, noop on supabase
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS "auth"."users" (
  "id" uuid NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."workspace" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "name" text NOT NULL DEFAULT '',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_workspace" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS workspace_created_at ON workspace (created_at);
CREATE INDEX IF NOT EXISTS workspace_updated_at ON workspace (updated_at);

CREATE TABLE IF NOT EXISTS "public"."workspace_user" (
  "user_id" uuid NOT NULL,
  "workspace_id" character varying NOT NULL,
  "role" character varying NOT NULL CHECK(role in ('owner', 'member')),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_workspace_user" PRIMARY KEY ("user_id", "workspace_id"),
  CONSTRAINT "fk_workspace_id" FOREIGN KEY ("workspace_id")
    REFERENCES "public"."workspace"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id")
    REFERENCES "auth"."users"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS workspace_user_created_at ON workspace_user (created_at);
CREATE INDEX IF NOT EXISTS workspace_user_updated_at ON workspace_user (updated_at);

--
-- Meta
--

CREATE TABLE IF NOT EXISTS "public"."integration" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "workspace_id" character varying NOT NULL,
  "config" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_integration" PRIMARY KEY ("id"),
  CONSTRAINT "fk_workspace_id" FOREIGN KEY ("workspace_id")
    REFERENCES "public"."workspace"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS integration_created_at ON integration (created_at);
CREATE INDEX IF NOT EXISTS integration_updated_at ON integration (updated_at);

CREATE TABLE IF NOT EXISTS "public"."connection" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "workspace_id" character varying NOT NULL,
  "integration_id" character varying,
  "settings" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_connection" PRIMARY KEY ("id"),
  CONSTRAINT "fk_integration_id" FOREIGN KEY ("integration_id")
    REFERENCES "public"."integration"("id") ON DELETE RESTRICT,
  CONSTRAINT "fk_workspace_id" FOREIGN KEY ("workspace_id")
    REFERENCES "public"."workspace"("id") ON DELETE CASCADE

);
CREATE INDEX IF NOT EXISTS connection_created_at ON connection (created_at);
CREATE INDEX IF NOT EXISTS connection_updated_at ON connection (updated_at);

CREATE TABLE IF NOT EXISTS "public"."pipeline" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "workspace_id" character varying NOT NULL,
  "src_connection_id" character varying,
  "src_options" jsonb NOT NULL DEFAULT '{}',
  "dest_connection_id" character varying,
  "dest_options" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_pipeline" PRIMARY KEY ("id"),
  CONSTRAINT "fk_src_connection_id" FOREIGN KEY ("src_connection_id")
    REFERENCES "public"."connection"("id") ON DELETE RESTRICT,
  CONSTRAINT "fk_dest_connection_id" FOREIGN KEY ("dest_connection_id")
    REFERENCES "public"."connection"("id") ON DELETE RESTRICT,
  CONSTRAINT "fk_workspace_id" FOREIGN KEY ("workspace_id")
    REFERENCES "public"."workspace"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS pipeline_created_at ON pipeline (created_at);
CREATE INDEX IF NOT EXISTS pipeline_updated_at ON pipeline (updated_at);


--
-- LedgerSync
--

CREATE TABLE IF NOT EXISTS "public"."transaction" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "provider_name" character varying,
  "connection_id" character varying,
  "standard" jsonb NOT NULL DEFAULT '{}',
  "external" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_transaction" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS transaction_created_at ON transaction (created_at);
CREATE INDEX IF NOT EXISTS transaction_updated_at ON transaction (updated_at);

CREATE TABLE IF NOT EXISTS "public"."account" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "provider_name" character varying,
  "connection_id" character varying,
  "standard" jsonb NOT NULL DEFAULT '{}',
  "external" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_account" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS account_created_at ON account (created_at);
CREATE INDEX IF NOT EXISTS account_updated_at ON account (updated_at);

CREATE TABLE IF NOT EXISTS "public"."commodity" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "provider_name" character varying,
  "connection_id" character varying,
  "standard" jsonb NOT NULL DEFAULT '{}',
  "external" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_commodity" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS commodity_created_at ON commodity (created_at);
CREATE INDEX IF NOT EXISTS commodity_updated_at ON commodity (updated_at);

