CREATE INDEX IF NOT EXISTS users_api_key
  ON "auth"."users" ((raw_user_meta_data ->> 'apiKey'));
