DROP VIEW v_transaction;
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

DROP VIEW v_posting;
CREATE VIEW v_posting AS SELECT
	id
	,p.key
	,p.value #>>'{amount,quantity}' as amount_quantity
	,p.value #>>'{amount,unit}' as amount_unit
	,p.value ->>'accountId' as account_id
	,p.value as data
	from transaction, jsonb_each(transaction.standard->'postingsMap') as p;



alter table "transaction" add column "account_ids" character varying
NOT NULL GENERATED ALWAYS AS (ARRAY (
		SELECT DISTINCT kv.value ->> 'accountId'
		FROM
			jsonb_each(standard -> 'postingsMap') AS kv)) STORED,

SELECT
	id,
	ARRAY (
		SELECT DISTINCT kv.value ->> 'accountId'
		FROM
			jsonb_each(standard -> 'postingsMap') AS kv) as account_ids
	FROM
		"transaction";
