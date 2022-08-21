-- TODO: Consider using https://salsita.github.io/node-pg-migrate/#/migrations
-- to reduce the tons of duplication
CREATE TABLE IF NOT EXISTS "public"."transaction" (
  "id" character varying NOT NULL,
  "standard" jsonb NOT NULL DEFAULT '{}',
  "external" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_transaction_id" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS transaction_created_at ON transaction (created_at);
CREATE INDEX IF NOT EXISTS transaction_updated_at ON transaction (updated_at);

CREATE TABLE IF NOT EXISTS "public"."account" (
  "id" character varying NOT NULL,
  "standard" jsonb NOT NULL DEFAULT '{}',
  "external" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_account_id" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS account_created_at ON account (created_at);
CREATE INDEX IF NOT EXISTS account_updated_at ON account (updated_at);

CREATE TABLE IF NOT EXISTS "public"."commodity" (
  "id" character varying NOT NULL,
  "standard" jsonb NOT NULL DEFAULT '{}',
  "external" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_commodity_id" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS commodity_created_at ON commodity (created_at);
CREATE INDEX IF NOT EXISTS commodity_updated_at ON commodity (updated_at);

