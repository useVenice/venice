ALTER TABLE "public"."connection" RENAME TO "resource";
ALTER TABLE "public"."resource" RENAME CONSTRAINT pk_connection TO pk_resource;
ALTER INDEX connection_created_at RENAME TO resource_created_at;
ALTER INDEX connection_updated_at RENAME TO resource_updated_at;
ALTER INDEX connection_provider_name RENAME TO resource_provider_name;
ALTER INDEX connection_creator_id RENAME TO resource_creator_id;
ALTER FUNCTION auth.connection_ids RENAME TO auth.resource_ids;

ALTER POLICY connection_creator_access ON public.pipeline RENAME TO resource_creator_access;

ALTER TABLE "public"."transaction" RENAME COLUMN "ledger_connection_id" TO "ledger_resource_id";
ALTER TABLE "public"."account" RENAME COLUMN "ledger_connection_id" TO "ledger_resource_id";
ALTER TABLE "public"."commodity" RENAME COLUMN "ledger_connection_id" TO "ledger_resource_id";


ALTER POLICY ledger_connection_creator_access ON public.transaction RENAME TO ledger_resource_creator_access;
ALTER POLICY ledger_connection_creator_access ON public.account RENAME TO ledger_resource_creator_access;
ALTER POLICY ledger_connection_creator_access ON public.commodity RENAME TO ledger_resource_creator_access;
