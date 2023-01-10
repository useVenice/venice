-- TODO: Is it true that anon user would by default have access to ALL tables full read write in the absence of policies?
-- If so how do we have supabase be locked down by default?
-- Do we need to enable RLS on migrations table for example? And any other test tables we create?
-- https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security

-- TODO: Do things like easy mustache template for SQL exist? So we can avoid the duplication without needing to go into a full programming language?


-- Unfortunately we cannot do this because of of 1) uuid <> varchar mismatch
-- 2) OSS where users are managed outside of supabase

-- ALTER TABLE "public"."connection" DROP COLUMN "ledger_id"; -- Not yet, but soon
-- ALTER TABLE "public"."connection" ADD COLUMN "creator_id" uuid; -- TODO: Make me not null
-- ALTER TABLE "public"."connection" ADD CONSTRAINT "fk_connection_creator_id"
--   FOREIGN KEY ("creator_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE "public"."connection" RENAME COLUMN "ledger_id" to "creator_id";
CREATE INDEX IF NOT EXISTS connection_creator_id ON connection (creator_id);

ALTER TABLE "public"."connection" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "creator_access" on "public"."connection";
CREATE POLICY "creator_access" ON "public"."connection"
  USING (creator_id = auth.uid()::varchar)
  WITH CHECK (creator_id = auth.uid()::varchar);


ALTER TABLE "public"."pipeline" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "connection_creator_access" on "public"."pipeline";
CREATE POLICY "connection_creator_access" ON "public"."pipeline"
  USING (EXISTS (
    SELECT 1 FROM "connection" WHERE ("pipeline"."source_id" = "connection"."id" OR "pipeline"."destination_id" = "connection"."id") AND "connection"."creator_id" = auth.uid()::varchar
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM "connection" WHERE ("pipeline"."source_id" = "connection"."id" OR "pipeline"."destination_id" = "connection"."id") AND "connection"."creator_id" = auth.uid()::varchar
  ));


ALTER TABLE "public"."integration" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_readable" ON public.integration FOR SELECT USING (true);

ALTER TABLE "public"."institution" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_readable" ON public.institution FOR SELECT USING (true);

ALTER TABLE "public"."migrations" ENABLE ROW LEVEL SECURITY;

--| Transaction |--

ALTER TABLE "public"."transaction" ADD COLUMN "ledger_connection_id" VARCHAR; -- How do we make this non-null?
ALTER TABLE "public"."transaction" ADD CONSTRAINT "fk_transaction_ledger_connection_id"
  FOREIGN KEY ("ledger_connection_id") REFERENCES "public"."connection"("id") ON DELETE CASCADE;

ALTER TABLE "public"."transaction" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ledger_connection_creator_access" on "public"."transaction";
CREATE POLICY "ledger_connection_creator_access" ON "public"."transaction"
  USING (EXISTS (
    SELECT 1 FROM "connection" WHERE "transaction"."ledger_connection_id" = "connection"."id" AND "connection"."creator_id" = auth.uid()::varchar
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM "connection" WHERE "transaction"."ledger_connection_id" = "connection"."id" AND "connection"."creator_id" = auth.uid()::varchar
  ));

--| Account |--

ALTER TABLE "public"."account" ADD COLUMN "ledger_connection_id" varchar;
ALTER TABLE "public"."account" ADD CONSTRAINT "fk_account_ledger_connection_id"
  FOREIGN KEY ("ledger_connection_id") REFERENCES "public"."connection"("id") ON DELETE CASCADE;


ALTER TABLE "public"."account" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ledger_connection_creator_access" on "public"."account";
CREATE POLICY "ledger_connection_creator_access" ON "public"."account"
  USING (EXISTS (
    SELECT 1 FROM "connection" WHERE "account"."ledger_connection_id" = "connection"."id" AND "connection"."creator_id" = auth.uid()::varchar
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM "connection" WHERE "account"."ledger_connection_id" = "connection"."id" AND "connection"."creator_id" = auth.uid()::varchar
  ));

--| Commodity |--
ALTER TABLE "public"."commodity" ADD COLUMN "ledger_connection_id" varchar;
ALTER TABLE "public"."account" ADD CONSTRAINT "fk_account_ledger_connection_id"
  FOREIGN KEY ("ledger_connection_id") REFERENCES "public"."connection"("id") ON DELETE CASCADE;

ALTER TABLE "public"."commodity" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ledger_connection_creator_access" on "public"."commodity";
CREATE POLICY "ledger_connection_creator_access" ON "public"."commodity"
  USING (EXISTS (
    SELECT 1 FROM "connection" WHERE "commodity"."ledger_connection_id" = "connection"."id" AND "connection"."creator_id" = auth.uid()::varchar
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM "connection" WHERE "commodity"."ledger_connection_id" = "connection"."id" AND "connection"."creator_id" = auth.uid()::varchar
  ));


