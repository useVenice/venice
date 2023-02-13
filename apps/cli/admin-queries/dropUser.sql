REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM "usr_24519924-a569-4243-9a98-fd9f087cd6a3";
REVOKE USAGE ON SCHEMA public FROM "usr_24519924-a569-4243-9a98-fd9f087cd6a3";
DROP USER "usr_24519924-a569-4243-9a98-fd9f087cd6a3";
UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data - 'apiKey' WHERE id = ${userId};