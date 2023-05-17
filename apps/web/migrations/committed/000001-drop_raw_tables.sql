--! Previous: -
--! Hash: sha1:0a2484771cafcd5272cae0b72391787a3cd0e2d6
--! Message: drop_raw_tables

--! split: 1-current.sql
-- Enter migration here
DROP TABLE IF EXISTS "public"."migrations";
DROP TABLE IF EXISTS "public"."raw_account";
DROP TABLE IF EXISTS "public"."raw_commodity";
DROP TABLE IF EXISTS "public"."raw_transaction";
