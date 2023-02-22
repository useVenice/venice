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
			EXECUTE format('
GRANT %I to postgres;
GRANT SELECT, UPDATE, DELETE ON public.transaction, public.posting TO %I;
', ele.usename, ele.usename);
		END LOOP;
END;
$$;
