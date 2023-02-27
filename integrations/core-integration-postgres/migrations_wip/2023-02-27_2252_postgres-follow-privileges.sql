-- Workaround the issue where public.migrations table show up for anonymous users...
-- @see https://usevenice.slack.com/archives/C04NUANB7FW/p1677504283755269?thread_ts=1677488220.098729&cid=C04NUANB7FW

-- Must run from supabase sql dashboard otherwise will get the following error
-- Query 1 ERROR: ERROR:  "authenticator" is a reserved role, only superusers can modify it

ALTER ROLE authenticator SET pgrst.openapi_mode TO 'follow-privileges';
ALTER ROLE authenticated SET pgrst.openapi_mode TO 'follow-privileges';
ALTER ROLE anon SET pgrst.openapi_mode TO 'follow-privileges';

-- NOTE This doesn't currently work at the moment unfortunately...
