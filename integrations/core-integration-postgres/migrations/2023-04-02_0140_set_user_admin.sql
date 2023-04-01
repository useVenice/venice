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
