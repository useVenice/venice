DROP VIEW IF EXISTS v_transaction;
CREATE VIEW v_transaction AS SELECT
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
	TRANSACTION;

DROP VIEW IF EXISTS v_posting;
CREATE VIEW v_posting AS SELECT
	id
	,p.key
	,p.value #>>'{amount,quantity}' as amount_quantity
	,p.value #>>'{amount,unit}' as amount_unit
	,p.value ->>'accountId' as account_id
	,p.value as data
	from transaction, jsonb_each(transaction.standard->'postingsMap') as p;


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
