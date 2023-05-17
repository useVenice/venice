
CREATE TABLE IF NOT EXISTS "public"."migrations" (
    name text NOT NULL,
    hash text NOT NULL,
    date timestamp with time zone DEFAULT now() NOT NULL
);
