REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM "usr_deca735c-a043-4394-b12d-33e4b3717a83";
REVOKE USAGE ON SCHEMA public FROM "usr_deca735c-a043-4394-b12d-33e4b3717a83";
DROP USER "usr_deca735c-a043-4394-b12d-33e4b3717a83";
UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data - 'apiKey' WHERE id = ${userId};

