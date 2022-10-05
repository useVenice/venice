---
title: Venice
description: Venice is a the fastest way to get financial data from Plaid into your Postgres database.
---
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
<p align="center">
  <img src="https://link.useVenice.com/logo" alt="Venice logo" width="250"> 
</p>


Zero to production in 5 minutes without a single line of code:

1. Add environment variables (Plaid API key, database credentials, JWT secret).
2. Embed pre-built UI with user-scoped `accessToken`.
3. Voila! Query data in your database.

## Quick start

**One click deploy with Vercel**

<a href="https://link.useVenice.com/deploy" rel="nofollow">
  <img src="https://vercel.com/button" alt="Deploy with Vercel">
</a>

<p>
  <a href="https://link.useVenice.com/demo-video" rel="nofollow">
    <img src="https://cdn.loom.com/sessions/thumbnails/a2eda4cd5c764963bd2d6a56fe5a71e5-with-play.gif" alt="Venice demo" style="max-width: 300px;">
  </a>
</p>

**Questions & support?**

<p>
  <a href="https://link.usevenice.com/slack" rel="nofollow">
    <img src="/slack-cta.png" alt="Join us on Slack" style="width: 10rem;">
  </a>
</p>

## Why we exist

We built Venice after working on multiple fintech products. Despite the explosion of amazing fintech services like Plaid, setting up a stack still takes a ton of work. Writing integration code, UI to help user manage their connections, maintaining uptime, running data pipelines, and building the company proved to be a lot to handle. There are a ton of undifferentated plumbing here and we think we can build it once as a community and not have everyone re-invent the wheel. That way fintech developers can do what they do best — build fintech, not ETL pipelines!

## What we built so far

- **Connection portal**:
  - Ready to use UI for your customers to add financial connections, repair broken ones, or manually trigger a sync. 
- **Token management**:
  - Keep track of access tokens and don't pay for the ones you don't use
- **Incremental sync**:
  - Fast and efficient sync that can be called idempotently
- **Rate limiting**:
  - End point specific rate limiting to maximize performance
- **Webhook handling**:
  - Get connection and data updates in real time. 
- **Database sync**:
  - Forget HTTP requests. The best API is the one from your database.
- **Extensible architecture**:
  - No code or full code, drop down to any level of abstraction you need. You can easily extend Venice to send data to Firebase, MongoDB, or your internal API for instance.

## Architecture

Venice scales up and down based on your needs. Get started with no-code, call API when the need arises, or get your hands dirty in source code with your custom fork.

Venice is designed to be modular and extensible. Drop down to the level of abstraction that best fits your need.

Here are 5 ways you can use Venice, each built on a layer below:

- No code self-service portal (Beta).
- Embeddable portal (Beta).
- Theme-able React components (Planned).
- Headless React components (Planned).
- Stateful HTTP API (trpc Alpha, OpenAPI planned).
- Stateless HTTP API where you handle your own persistence (Planned)
- TypeScript core library that runs on every platform that JS does (Planned)

## Getting started

1. Click the "Deploy to Vercel" link.
2. Create a repository on Vercel.
3. Go to Supabase.com and create a new project.
4. On Supabase, go to Settings > Database and scroll down to "Connection String" and click "URI".
5. Copy that link and insert it as your `POSTGRES_OR_WEBHOOK_URL` in Vercel — remember to add your password to the URL when you paste it into Vercel.
6. On Supabase, Go to Settings > API and scroll down to get your JWT token. Copy this and paste it into Vercel.
7. Go to Plaid > Team Settings > Keys and copy the Plaid ID and Sandbox Secret key into Vercel.
8. Deploy Vercel.
9. Once Vercel is ready, click to open the domain.
10. Go to jwt.io, enter the same JWT token here as you saw in Supabase. Copy this access token.
11. Paste the access token into the URL of the Vercel Domain and add the words "?accessToken=[YOUR ACCESS TOKEN]".
12. Voila! You should see your page. Click new connection and connect using Plaid Link. Visit the database or table in Supabase to see the transactions and accounts!

## Environment variables

| Name                              | Description                                                                                                                                                                                                                                                                                                                                                                                                     |
| :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SERVER_URL`          | Fully qualified url your venice next.js app used for redirects, webhooks and server-side rendering.</br>e.g. https://connect.example.com or http://localhost:3000 for development. Defaults to https://$VERCEL_URL if not provided</br>@see https://vercel.com/docs/concepts/projects/environment-variables</br>Providing this explicitly is still preferrred as $VERCEL_URL does not account for custom domain |
| `POSTGRES_OR_WEBHOOK_URL`         | Pass a valid postgres(ql):// url for stateful mode. Will be used Primary database used for metadata and user data storage</br>Pass a valid http(s):// url for stateless mode. Sync data and metadata be sent to provided URL and you are responsible for your own persistence                                                                                                                                   |
| `JWT_SECRET_OR_PUBLIC_KEY`        | Used for validating authenticity of accessToken                                                                                                                                                                                                                                                                                                                                                                 |
| `int_plaid__clientId`             | `string`                                                                                                                                                                                                                                                                                                                                                                                                        |
| `int_plaid__secrets__sandbox`     | `string` - (Optional)                                                                                                                                                                                                                                                                                                                                                                                           |
| `int_plaid__secrets__development` | `string` - (Optional)                                                                                                                                                                                                                                                                                                                                                                                           |
| `int_plaid__secrets__production`  | `string` - (Optional)                                                                                                                                                                                                                                                                                                                                                                                           |
| `int_plaid__clientName`           | `string = "This Application"` - The name of your application, as it should be displayed in Link.</br>Maximum length of 30 characters.</br>If a value longer than 30 characters is provided, Link will display "This Application" instead.                                                                                                                                                                       |
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
pnpm run venice syncConnection --id $connectionId

# Sync pipeline
pnpm run venice syncPipeline --source.id $connectionId --destination.id conn_fs --destination.settings.basePath ./data

# Sync pipeline by fully specifying all source & destination settings
pnpm run venice syncPipeline --source.id conn_plaid --source.settings.accessToken $accessToken --destination.id conn_fs --destination.settings.basePath ./data
```

Tips
- Use [`shdotenv`](https://github.com/ko1nksm/shdotenv) to load env vars from .env files

## FAQs

Why is it called Venice?

> First to pay homage to Venice as the birth place of modern accounting. Second, the Venetian canals were used to transport goods, much like useVenice pipelines are used to transport financial data. 

Do you get to see any of the data we pass through?

> No. You deploy this within your own infra.

What are we working now and next?

> Join the discussion at our [GitHub Roadmap Project](https://link.useVenice.com/roadmap).

## Contribute & Support

<p>
  <a href="https://link.usevenice.com/slack" rel="nofollow">
    <img src="/slack-cta.png" alt="Join us on Slack" style="width: 10rem;">
  </a>
</p>
