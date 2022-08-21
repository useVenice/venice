-- TODO: Consider using https://salsita.github.io/node-pg-migrate/#/migrations
-- to reduce the tons of duplication
CREATE TABLE IF NOT EXISTS "public"."meta" (
  "id" character varying NOT NULL,
  "data" jsonb NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "pk_meta_id" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS meta_created_at ON meta (created_at);
CREATE INDEX IF NOT EXISTS meta_updated_at ON meta (updated_at);

