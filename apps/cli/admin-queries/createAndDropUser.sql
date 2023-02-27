-- Create user
CREATE USER "usr_deca735c-a043-4394-b12d-33e4b3717a83" PASSWORD "key_test";
GRANT "usr_deca735c-a043-4394-b12d-33e4b3717a83" TO "postgres";
GRANT USAGE ON SCHEMA public TO "usr_deca735c-a043-4394-b12d-33e4b3717a83";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "usr_deca735c-a043-4394-b12d-33e4b3717a83";
REVOKE ALL PRIVILEGES ON public.migrations FROM "usr_deca735c-a043-4394-b12d-33e4b3717a83";
REVOKE ALL PRIVILEGES ON public.integration FROM "usr_deca735c-a043-4394-b12d-33e4b3717a83";
UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || 'key_test' WHERE id = 'deca735c-a043-4394-b12d-33e4b3717a83';

-- Drop user
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM "usr_deca735c-a043-4394-b12d-33e4b3717a83";
REVOKE USAGE ON SCHEMA public FROM "usr_deca735c-a043-4394-b12d-33e4b3717a83";
DROP USER "usr_deca735c-a043-4394-b12d-33e4b3717a83";
UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data - 'apiKey' WHERE id = ${userId};

