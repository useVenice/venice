# useVenice

Fastest way from Plaid to your database

## One click deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?env=NEXT_PUBLIC_SERVER_URL%2CPOSTGRES_URL%2CJWT_SECRET_OR_PUBLIC_KEY%2Cint_plaid__clientId%2Cint_plaid__secrets__sandbox%2Cint_plaid__secrets__development%2Cint_plaid__secrets__production%2Cint_plaid__clientName%2Cint_plaid__products%2Cint_plaid__countryCodes%2Cint_plaid__language&envDescription=Not%20all%20values%20are%20required.%20Use%20empty%20space%20to%20skip%20values&envLink=https%3A%2F%2Fgithub.com%2Falkafinance%2Fledger-sync%2Fblob%2Fmain%2Fapps%2Fapp-config%2FREADME.md&project-name=my-ledger-sync&repository-url=https%3A%2F%2Fgithub.com%2Falkafinance%2Fledger-sync&root-directory=apps%2Fnext)

Zero to production in 5 minutes without a single line of code
1. Add env vars (Plaid API key, db credentials, JWT secret)
2. Embed pre-built UI
3. Voila! Query data in your database

## Environment variables

| Name                              | Description                                                                                                                                                                                                                                                                                                                                                                                                     |
| :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SERVER_URL`          | Fully qualified url your venice next.js app used for redirects, webhooks and server-side rendering.</br>e.g. https://connect.example.com or http://localhost:3000 for development. Defaults to https://$VERCEL_URL if not provided</br>@see https://vercel.com/docs/concepts/projects/environment-variables</br>Providing this explicitly is still preferrred as $VERCEL_URL does not account for custom domain |
| `POSTGRES_URL`                    | Primary database used for metadata and user data storage                                                                                                                                                                                                                                                                                                                                                        |
| `JWT_SECRET_OR_PUBLIC_KEY`        | Used for validating authenticity of accessToken                                                                                                                                                                                                                                                                                                                                                                 |
| `int_plaid__clientId`             | `string`                                                                                                                                                                                                                                                                                                                                                                                                        |
| `int_plaid__secrets__sandbox`     | `string` - (Optional)                                                                                                                                                                                                                                                                                                                                                                                           |
| `int_plaid__secrets__development` | `string` - (Optional)                                                                                                                                                                                                                                                                                                                                                                                           |
| `int_plaid__secrets__production`  | `string` - (Optional)                                                                                                                                                                                                                                                                                                                                                                                           |
| `int_plaid__clientName`           | `string` - The name of your application, as it should be displayed in Link.</br>Maximum length of 30 characters.</br>If a value longer than 30 characters is provided, Link will display "This Application" instead.                                                                                                                                                                                            |
| `int_plaid__products`             | `Array<assets \| auth \| balance \| identity \| investments \| liabilities \| payment_initiation \| transactions \| credit_details \| income \| income_verification \| deposit_switch \| standing_orders \| transfer \| employment \| recurring_transactions> = ["transactions"]`                                                                                                                               |
| `int_plaid__countryCodes`         | `Array<US \| GB \| ES \| NL \| FR \| IE \| CA \| DE \| IT> = ["US"]`                                                                                                                                                                                                                                                                                                                                            |
| `int_plaid__language`             | `en \| fr \| es \| nl \| de = "en"`                                                                                                                                                                                                                                                                                                                                                                             |



## Local development

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

