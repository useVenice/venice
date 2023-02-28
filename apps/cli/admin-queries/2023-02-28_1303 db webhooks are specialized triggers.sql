

-- List existing triggers
SELECT
	*
FROM
	information_schema.triggers;




-- Listed under dupabase database/triggers https://share.cleanshot.com/bGxchMMZ

CREATE OR REPLACE TRIGGER "pipeline-after-insert2"
	AFTER INSERT OR UPDATE OR DELETE ON public.pipeline FOR ROW
	EXECUTE FUNCTION trigger_function ();

-- Need a special trigger function though. Shows as part of function list in public schema, not sure if desired?
CREATE FUNCTION trigger_function ()
	RETURNS TRIGGER
	LANGUAGE PLPGSQL
	AS $$
BEGIN
	SELECT
		1;
END;
$$

;

drop trigger "pipeline-after-insert2" on public.pipeline;
drop function trigger_function();

--


-- Need pg_net to as supabase_functions.http_request depends on pg_net
create EXTENSION if not exists pg_net;



drop trigger "pipeline-after-insert" on public.pipeline;

-- Database webhoooks is just a special type of trigger, and is listed under `webhooks` while excluded from `triggers` section
CREATE TRIGGER "pipeline-after-insert"
	AFTER INSERT ON public.pipeline FOR ROW
	EXECUTE FUNCTION supabase_functions.http_request ('https://webhook.site/b299d051-2f16-4a97-bdb8-6e2b70552d46', 'POST', '{"Content-type":"application/json"}', '{}', '1000');


-- This does NOT work. No idea why. TODO: How to we get some variables in here?
-- CREATE TRIGGER "pipeline-after-insert"
-- 	AFTER INSERT ON public.pipeline FOR ROW
-- 	EXECUTE FUNCTION supabase_functions.http_request (current_setting('server.url'), 'POST', '{"Content-type":"application/json"}', '{}', '1000');



-- Shorthand for UPDATE pg_settings SET setting = reset_val WHERE name = 'configuration_parameter';
SET server.url TO 'https://xxx.ngrok.io/';

-- Shorthand for SET server.url TO DEFAULT;
RESET server.url;

-- shorthand for select * from pg_settings
show all;
table pg_settings;

show server.url;

SELECT current_setting('server.url');
select CURRENT_setting('pgrst.openapi_mode');

select * from pg_settings;
