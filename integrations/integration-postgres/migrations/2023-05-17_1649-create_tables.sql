CREATE TABLE IF NOT EXISTS "public"."transaction" (
  id character varying DEFAULT concat('txn_', public.generate_ulid()) NOT NULL,
  provider_name character varying GENERATED ALWAYS AS (split_part((id)::text, '_'::text, 2)) STORED NOT NULL,
  source_id character varying,
  standard jsonb DEFAULT '{}'::jsonb NOT NULL,
  external jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  end_user_id character varying,
  CONSTRAINT raw_transaction_id_prefix_check CHECK (starts_with((id)::text, 'txn_'::text)),
  CONSTRAINT "pk_transaction" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS transaction_created_at ON transaction (created_at);
CREATE INDEX IF NOT EXISTS transaction_updated_at ON transaction (updated_at);
CREATE INDEX IF NOT EXISTS transaction_provider_name ON transaction (provider_name);
CREATE INDEX IF NOT EXISTS transaction_source_id ON transaction (source_id);
CREATE INDEX IF NOT EXISTS transaction_end_user_id ON transaction (end_user_id);

CREATE TABLE IF NOT EXISTS "public"."account" (
  id character varying DEFAULT concat('acct_', public.generate_ulid()) NOT NULL,
  provider_name character varying GENERATED ALWAYS AS (split_part((id)::text, '_'::text, 2)) STORED NOT NULL,
  source_id character varying,
  standard jsonb DEFAULT '{}'::jsonb NOT NULL,
  external jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  end_user_id character varying,
  CONSTRAINT raw_account_id_prefix_check CHECK (starts_with((id)::text, 'acct_'::text)),
  CONSTRAINT "pk_account" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS account_created_at ON account (created_at);
CREATE INDEX IF NOT EXISTS account_updated_at ON account (updated_at);
CREATE INDEX IF NOT EXISTS account_provider_name ON account (provider_name);
CREATE INDEX IF NOT EXISTS account_source_id ON account (source_id);
CREATE INDEX IF NOT EXISTS account_end_user_id ON account (end_user_id);

CREATE TABLE IF NOT EXISTS "public"."commodity" (
  id character varying DEFAULT concat('comm_', public.generate_ulid()) NOT NULL,
  provider_name character varying GENERATED ALWAYS AS (split_part((id)::text, '_'::text, 2)) STORED NOT NULL,
  source_id character varying,
  standard jsonb DEFAULT '{}'::jsonb NOT NULL,
  external jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  end_user_id character varying,
  CONSTRAINT raw_commodity_id_prefix_check CHECK (starts_with((id)::text, 'comm_'::text)),
  CONSTRAINT "pk_commodity" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS commodity_created_at ON commodity (created_at);
CREATE INDEX IF NOT EXISTS commodity_updated_at ON commodity (updated_at);
CREATE INDEX IF NOT EXISTS commodity_provider_name ON commodity (provider_name);
CREATE INDEX IF NOT EXISTS commodity_source_id ON commodity (source_id);
CREATE INDEX IF NOT EXISTS commodity_end_user_id ON commodity (end_user_id);
