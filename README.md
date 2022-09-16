# Ledger Sync

## One click deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falkafinance%2Fledger-sync)

That's it. 

## Get started with development

1. Clone repo `git clone git@github.com:alkafinance/ledger-sync.git`

2. Copy `.env.example` into `.env` and populate your own values

3. Install dependencies & run

```bash
nvm use 16 # Optional, we recommend node 16.x
pnpm install
pnpm run migration up # Other databases such as Mongo / Redis / Firebase will be supported later. Let us know if you would like to contribute
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

