-- Note once we drop view we will have to re-grant them to everyone in `public`, which is a bit annoying...

DROP VIEW IF EXISTS transaction;
CREATE VIEW transaction WITH (security_invoker) AS SELECT
	id -- standard->>'_id' as id
	,standard->>'date' as date
	,standard->> 'description' as description
	,standard->> 'payee' as payee
	,standard#>> '{postingsMap,main,amount,quantity}' as amount_quantity
	,standard#>> '{postingsMap,main,amount,unit}' as amount_unit
	,standard#>> '{postingsMap,main,accountId}' as account_id
	,standard->> 'externalCategory' as external_category
	,standard->> 'notes'  as notes
	,standard->> 'postingsMap' as postings
FROM
	"raw_transaction";

DROP VIEW IF EXISTS posting;
CREATE VIEW posting WITH (security_invoker) AS SELECT
	id
	,p.key
	,p.value #>>'{amount,quantity}' as amount_quantity
	,p.value #>>'{amount,unit}' as amount_unit
	,p.value ->>'accountId' as account_id
	,p.value as data
	from "raw_transaction", jsonb_each("raw_transaction".standard->'postingsMap') as p;


-- Needed to re-grant permission to all users to access the view whenever we re-construct it
DO $$
DECLARE
	ele record;
BEGIN
	FOR ele IN
		SELECT
			usename
		FROM
			pg_user
		WHERE
			starts_with (usename, 'usr_')
	LOOP
		EXECUTE format('GRANT SELECT, UPDATE, DELETE ON public.transaction, public.posting TO %I', ele.usename);
	END LOOP;
END;
$$;

---

REVOKE ALL ON pg_catalog.pg_user FROM public;
-- This will prevent user from being able to query for the existance of other users.
-- TODO: What other permissions does the `public` role have that they shouldn't have in this context?

---


CREATE OR REPLACE FUNCTION jsonb_array_to_text_array(_js jsonb)
  RETURNS text[]
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT AS
'SELECT ARRAY(SELECT jsonb_array_elements_text(_js))';

ALTER TABLE "transaction"
	ADD COLUMN "account_ids" text [] NOT NULL GENERATED ALWAYS AS (
jsonb_array_to_text_array (jsonb_path_query_array (standard, '$.postingsMap.*.accountId'))) STORED;


SELECT
	id,
	ARRAY (
		SELECT DISTINCT kv.value ->> 'accountId'
		FROM
			jsonb_each(standard -> 'postingsMap') AS kv) as account_ids
	FROM
		"transaction";
