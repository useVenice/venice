
REVOKE ALL ON pg_catalog.pg_user FROM public;
-- This will prevent user from being able to query for the existance of other users.
-- TODO: What other permissions does the `public` role have that they shouldn't have in this context?


-- TODO: We ran this query on dev postgres accidentally, how do we revert it back?


SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name='pg_user';

SELECT
	*
FROM
	information_schema.table_privileges
WHERE
	grantee = 'PUBLIC' and "table_name" = 'pg_user';

select * from pg_shadow;

grant select on pg_catalog.pg_user to public;


SELECT *
FROM pg_default_acl;

select * from pg_authid;
