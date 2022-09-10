--
-- Meta: App level
--


-- TODO(p2): Add generated column as well as indexes on them (e.g. institution name full text search)

-- TODO(p3): Add check guards id prefixes...
-- TODO(p3): Switch to the references / primary key syntax
-- TODO(p3): Use varchar rather than character varying to be shorter

CREATE TABLE IF NOT EXISTS "public"."integration" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  -- "standard" jsonb NOT NULL DEFAULT '{}', What should it be?
  "config" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_integration" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS integration_created_at ON integration (created_at);
CREATE INDEX IF NOT EXISTS integration_updated_at ON integration (updated_at);


CREATE TABLE IF NOT EXISTS "public"."institution" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "standard" jsonb NOT NULL DEFAULT '{}',
  "external" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_institution" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS institution_created_at ON institution (created_at);
CREATE INDEX IF NOT EXISTS institution_updated_at ON institution (updated_at);

--
-- Meta: Ledger specific
--

CREATE TABLE IF NOT EXISTS "public"."connection" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
  "ledger_id" character varying NOT NULL,
  "integration_id" character varying,
  "institution_id" character varying,
  "env_name" character varying,
  -- "standard" jsonb NOT NULL DEFAULT '{}', What should it be?
  "settings" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_connection" PRIMARY KEY ("id"),
  CONSTRAINT "fk_integration_id" FOREIGN KEY ("integration_id")
    REFERENCES "public"."integration"("id") ON DELETE RESTRICT
  -- TODO(p2): Add me back once we figure out how to ensure institution
  -- are always inserted before connections...
  -- ,
  -- CONSTRAINT "fk_institution_id" FOREIGN KEY ("institution_id")
  --   REFERENCES "public"."institution"("id") ON DELETE RESTRICT
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
  "links" jsonb NOT NULL DEFAULT '{}',
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
-- Data
--

CREATE TABLE IF NOT EXISTS "public"."transaction" (
  "id" character varying NOT NULL DEFAULT generate_ulid(),
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
  "source_id" character varying,
  "standard" jsonb NOT NULL DEFAULT '{}',
  "external" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_commodity" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS commodity_created_at ON commodity (created_at);
CREATE INDEX IF NOT EXISTS commodity_updated_at ON commodity (updated_at);

-- Add balance table
-- Add price table
