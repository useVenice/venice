# Ledger Sync

## Get started

```bash
git clone git@github.com:alkafinance/ledger-sync.git
```

1. Copy .env.example into .env and populate your own values

2. Run the migrations files manually inside `apps/app/migrations` against a postgres database you would like to use

   - Other databases such as Mongo / Redis / Firebase will be supported later. Let us know if you would like to contribute

3. Install dependencies & run

```bash
nvm use 16 # Optional, we recommend node 16.x
pnpm install
pnpm run dev

```

4. Visit `http://localhost:3000`

Couple things you can try

- Connect via first selecting institution vs. connecting via selecting provider
- LedgerSync works fully as a CLI tool as well

```bash
# Sync a connection
pnpm run ledgerSync syncConnection --id $connectionId

# Sync pipeline
pnpm run ledgerSync syncPipeline --src.id $connectionId --dest.provider fs --dest.settings.basePath ./data

# Sync pipeline by fully specifying all source & destination settings
pnpm run ledgerSync syncPipeline --src.provider plaid --src.settings.accessToken $accessToken --dest.provider fs --dest.settings.basePath ./data
```

## What are we working now and next?

@see https://github.com/orgs/alkafinance/projects/2/views/1

## Contribute & Support

If you aren't in Slack already, hit us up and we'll add you.

For integration development, we found the following tools really helpful for generating
type as well as api clients
- https://api.openapi-generator.tech/index.html
- https://transform.tools/
