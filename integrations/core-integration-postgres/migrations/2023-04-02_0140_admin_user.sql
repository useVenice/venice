create or replace procedure auth.set_user_admin (user_email text, admin boolean)
    language plpgsql
    as $$
declare
    auth_user record;
begin
	UPDATE
		auth.users
	SET
		raw_user_meta_data = raw_user_meta_data || jsonb_build_object('isAdmin', admin)
	WHERE
		email = user_email;
end
$$;

CREATE OR REPLACE FUNCTION auth.is_admin() RETURNS boolean LANGUAGE sql STABLE
AS $function$
  select coalesce(
    (
      nullif(current_setting('request.jwt.claims', true), '')::jsonb #> '{user_metadata,isAdmin}'
    ) :: boolean, FALSE
  )
$function$;

CREATE POLICY "admin_access" ON "public"."raw_commodity" USING (auth.is_admin());
CREATE POLICY "admin_access" ON "public"."raw_transaction" USING (auth.is_admin());
CREATE POLICY "admin_access" ON "public"."raw_account" USING (auth.is_admin());
CREATE POLICY "admin_access" ON "public"."institution" USING (auth.is_admin());

CREATE POLICY "admin_access" ON "public"."integration" USING (auth.is_admin());
CREATE POLICY "admin_access" ON "public"."resource" USING (auth.is_admin());
CREATE POLICY "admin_access" ON "public"."pipeline" USING (auth.is_admin());

CREATE POLICY "admin_access" ON "public"."migrations" USING (auth.is_admin());
