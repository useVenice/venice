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

CREATE TABLE IF NOT EXISTS "public"."integration" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "ledger_id" character varying NOT NULL,
  "config" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_integration" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS integration_created_at ON integration (created_at);
CREATE INDEX IF NOT EXISTS integration_updated_at ON integration (updated_at);

CREATE TABLE IF NOT EXISTS "public"."connection" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "ledger_id" character varying NOT NULL,
  "integration_id" character varying,
  "settings" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_connection" PRIMARY KEY ("id"),
  CONSTRAINT "fk_integration_id" FOREIGN KEY ("integration_id")
    REFERENCES "public"."integration"("id") ON DELETE RESTRICT

);
CREATE INDEX IF NOT EXISTS connection_created_at ON connection (created_at);
CREATE INDEX IF NOT EXISTS connection_updated_at ON connection (updated_at);

CREATE TABLE IF NOT EXISTS "public"."pipeline" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "ledger_id" character varying NOT NULL,
  "source_id" character varying,
  "source_options" jsonb NOT NULL DEFAULT '{}',
  "destination_id" character varying,
  "destination_options" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_pipeline" PRIMARY KEY ("id"),
  CONSTRAINT "fk_source_id" FOREIGN KEY ("source_id")
    REFERENCES "public"."connection"("id") ON DELETE RESTRICT,
  CONSTRAINT "fk_destination_id" FOREIGN KEY ("destination_id")
    REFERENCES "public"."connection"("id") ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS pipeline_created_at ON pipeline (created_at);
CREATE INDEX IF NOT EXISTS pipeline_updated_at ON pipeline (updated_at);


--
-- LedgerSync
--

CREATE TABLE IF NOT EXISTS "public"."transaction" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "provider_name" character varying,
  "source_id" character varying, -- Intentionally no reference, may be stored in separate db
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
  "source_id" character varying,
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
  "source_id" character varying,
  "standard" jsonb NOT NULL DEFAULT '{}',
  "external" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_commodity" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS commodity_created_at ON commodity (created_at);
CREATE INDEX IF NOT EXISTS commodity_updated_at ON commodity (updated_at);

