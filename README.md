# Venice

<p align="center">
  <img src="https://link.useVenice.com/logo" alt="Venice logo" width="250"> 
</p>

**Venice** is a the fastest way from Plaid to your Postgres database.

Zero to production in 5 minutes without a single line of code:

1. Add environment variables (Plaid API key, database credentials, JWT secret).
2. Embed pre-built UI.
3. Voila! Query data in your database.

## One-click Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://link.useVenice.com/deploy)


## Table of Contents

- [Why We Exist](#why-we-exist)
- [What We Built](#what-we-built)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Key Concepts](#key-concepts)
- [FAQs](#faqs)
- [Contribute & Support](#contribute--support)

## Why We Exist

We built Venice after working on multiple fintech products. Setting up banking aggregators, normalizing data, maintaining pipelines, and building the company proved to be a lot to handle. What if we could handle the plumbing? That way fintech developers can do what they do best — build!

## What We Built

- **Connection portal**:
  - Repair broken connections, add new ones, or manually trigger a sync.
- **Webhook handling**:
  - Get connection updates in real time.
- **Database sync**:
  - Forget HTTP requests. The best API is the one from your database.
- **Extensible architecture**:
  - Based on years spent building data integrations.

## Architecture

Venice scales up and down based on your needs. Get started with no-code, call API when the need arises, or get your hands dirty in source code with your custom fork.

Venice is designed to be modular and extensible. Drop down to the level of abstraction that best fits your need.

Here are 5 ways you can use Venice, each built on a layer below:

- No code self-service portal (Beta).
- Embeddable portal (Beta).
- Theme-able React components (Planned).
- Headless React components (Planned).
- HTTP API (trpc Alpha, OpenAPI planned).

## Getting Started

1. Click the "Deploy to Vercel" link.
2. Create a repository on Vercel.
3. Go to Supabase.com and create a new project.
4. On Supabase, go to Settings > Database and scroll down to "Connection String" and click "URI".
5. Copy that link and insert it as your `POSTGRES_URL` in Vercel — remember to add your password to the URL when you paste it into Vercel.
6. On Supabase, Go to Settings > API and scroll down to get your JWT token. Copy this and paste it into Vercel.
7. Go to Plaid > Team Settings > Keys and copy the Plaid ID and Sandbox Secret key into Vercel.
8. Deploy Vercel.
9. Once Vercel is ready, click to open the domain.
10. Go to jwt.io, enter the same JWT token here as you saw in Supabase. Copy this access token.
11. Paste the access token into the URL of the Vercel Domain and add the words "?accessToken=[YOUR ACCESS TOKEN]".
12. Voila! You should see your page. Click new connection and connect using Plaid Link. Visit the database or table in Supabase to see the transactions and accounts!

## Environment Variables

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

## Local Development

1. Clone repo `git clone git@github.com:usevenice/venice.git`.

2. Copy `.env.example` into `.env` and populate your own values.

3. Install dependencies and run:

```bash
nvm use 16 # Optional, we recommend node 16.x
pnpm install
pnpm run migration up # Other databases such as Mongo / Redis / Firebase will be supported later. Let us know if you would like to contribute
pnpm run dev
```

4. Visit `http://localhost:3000`.

Couple things you can try:

- Connect via first selecting institution vs. connecting via selecting provider.
- Venice works fully as a CLI tool as well.

```bash
# Sync a connection
pnpm run ledgerSync syncConnection --id $connectionId

# Sync pipeline
pnpm run ledgerSync syncPipeline --src.id $connectionId --dest.provider fs --dest.settings.basePath ./data

# Sync pipeline by fully specifying all source & destination settings
pnpm run ledgerSync syncPipeline --src.provider plaid --src.settings.accessToken $accessToken --dest.provider fs --dest.settings.basePath ./data
```

## Key Concepts

- **Integration**:
  - This is a data source or destination enabled in your application and may optionally contain configurations such as OAuth client ID / secret, API keys to service providers like Plaid and Yodlee.
  - Once configured, integrations are stateless and do not change between synchronizations.
- **Connection**:
  - Connection is always tied to an integration and contains credentials to needed to read or write data. For example, this would be a Plaid item `accessToken`, or a Postgres database connection string.
- **Pipeline**:
  - Pipelines get data from a source connection to a destination connection, and can contain `state` that is used for incremental synchronization.

## FAQs

Why is it called Venice?

> First to pay homage to Venice as the birth place of modern accounting. Second, the Venetian canals were used to transport goods, much like the Venice pipelines can be used to transport services

Who owns the relationship with the providers?

> We may choose to help with this in the future, but for now, you do.

Do you get to see any of the data we pass through?

> No. You deploy this within your own infra.

What are we working now and next?

> Join the discussion at our [GitHub Roadmap Project](https://link.useVenice.com/roadmap)

## Contribute & Support

<p>
  <a href="https://link.usevenice.com/slack" rel="nofollow">
    <img src="/slack-cta.png" alt="Join us on Slack" style="width: 10rem;">
  </a>
</p>

For integration development, we found the following tools really helpful for generating
type as well as API clients:

- https://api.openapi-generator.tech/index.html
- https://transform.tools/
