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
	,updated_at
	,created_at
FROM
	"raw_transaction";


DROP VIEW IF EXISTS account;
CREATE VIEW account WITH (security_invoker) AS SELECT
	id -- standard->>'_id' as id
	,standard->>'name' as name
	,standard->> 'type' as type
	,standard->> 'lastFour' as last_four
	,standard->> 'institutionName' as institution_name
	,standard->> 'defaultUnit' as default_unit
	,standard#>> '{informationalBalances,current,quantity}' as current_balance
	,standard#>> '{informationalBalances,available,quantity}' as available_balance
	,updated_at
	,created_at
FROM
	"raw_account";

DROP VIEW IF EXISTS transaction_split;
CREATE VIEW transaction_split WITH (security_invoker) AS SELECT
	id as transaction_id
	,s.key
	,s.value #>>'{amount,quantity}' as amount_quantity
	,s.value #>>'{amount,unit}' as amount_unit
	,s.value ->>'accountId' as account_id
	,s.value as data
	,updated_at
	,created_at
FROM "raw_transaction", 
	jsonb_each("raw_transaction".standard->'postingsMap') AS s;


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
		EXECUTE format('GRANT SELECT, UPDATE, DELETE ON public.transaction, public.account, public.transaction_split TO %I', ele.usename);
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


--- Toy functions.

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
