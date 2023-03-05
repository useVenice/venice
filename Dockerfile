FROM node:18-alpine as base

RUN npm install -g pnpm

FROM base as dependencies

WORKDIR /venice

COPY tsconfig.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./patches/ ./patches
# Ideally we can do something with pnpm -r exec "copy package.json over to docker..."
# Short of that we just manually run this command instead
# find . -not -path '*/node_modules/*' -not -path '*/.next/*' -name 'package.json'
COPY ./integrations/integration-alphavantage/package.json ./integrations/integration-alphavantage/package.json
COPY ./integrations/integration-qbo/package.json ./integrations/integration-qbo/package.json
COPY ./integrations/core-integration-webhook/package.json ./integrations/core-integration-webhook/package.json
COPY ./integrations/integration-import/package.json ./integrations/integration-import/package.json
COPY ./integrations/integration-foreceipt/package.json ./integrations/integration-foreceipt/package.json
COPY ./integrations/integration-stripe/package.json ./integrations/integration-stripe/package.json
COPY ./integrations/integration-postgres/package.json ./integrations/integration-postgres/package.json
COPY ./integrations/integration-venmo/package.json ./integrations/integration-venmo/package.json
COPY ./integrations/integration-splitwise/package.json ./integrations/integration-splitwise/package.json
COPY ./integrations/integration-yodlee/package.json ./integrations/integration-yodlee/package.json
COPY ./integrations/core-integration-mongodb/package.json ./integrations/core-integration-mongodb/package.json
COPY ./integrations/core-integration-fs/package.json ./integrations/core-integration-fs/package.json
COPY ./integrations/integration-ramp/package.json ./integrations/integration-ramp/package.json
COPY ./integrations/integration-wise/package.json ./integrations/integration-wise/package.json
COPY ./integrations/integration-teller/package.json ./integrations/integration-teller/package.json
COPY ./integrations/integration-expensify/package.json ./integrations/integration-expensify/package.json
COPY ./integrations/integration-saltedge/package.json ./integrations/integration-saltedge/package.json
COPY ./integrations/integration-lunchmoney/package.json ./integrations/integration-lunchmoney/package.json
COPY ./integrations/integration-toggl/package.json ./integrations/integration-toggl/package.json
COPY ./integrations/integration-beancount/package.json ./integrations/integration-beancount/package.json
COPY ./integrations/core-integration-redis/package.json ./integrations/core-integration-redis/package.json
COPY ./integrations/integration-onebrick/package.json ./integrations/integration-onebrick/package.json
COPY ./integrations/core-integration-postgres/package.json ./integrations/core-integration-postgres/package.json
COPY ./integrations/core-integration-firebase/package.json ./integrations/core-integration-firebase/package.json
COPY ./integrations/core-integration-airtable/package.json ./integrations/core-integration-airtable/package.json
COPY ./integrations/integration-plaid/package.json ./integrations/integration-plaid/package.json
COPY ./integrations/integration-moota/package.json ./integrations/integration-moota/package.json
COPY ./package.json ./package.json
COPY ./packages/engine-backend/package.json ./packages/engine-backend/package.json
COPY ./packages/ui/package.json ./packages/ui/package.json
COPY ./packages/util/package.json ./packages/util/package.json
COPY ./packages/standard/package.json ./packages/standard/package.json
COPY ./packages/engine-frontend/package.json ./packages/engine-frontend/package.json
COPY ./packages/cdk-core/package.json ./packages/cdk-core/package.json
COPY ./packages/cdk-ledger/package.json ./packages/cdk-ledger/package.json
# Specifically excluded
# COPY ./apps/web/.next/package.json ./apps/web/.next/package.json
# COPY ./apps/web/package.json ./apps/web/package.json
# COPY ./apps/tests/package.json ./apps/tests/package.json
COPY ./apps/cli/package.json ./apps/cli/package.json
COPY ./apps/airbyte/package.json ./apps/airbyte/package.json
COPY ./apps/app-config/package.json ./apps/app-config/package.json

# Before copying the rest of the app so we don't need to reinstall pnpm on every build
RUN pnpm install

COPY ./apps/ ./apps
COPY ./packages/ ./packages
COPY ./integrations/ ./integrations


ENTRYPOINT ["node",  "--no-warnings", "--loader", "/venice/node_modules/tsx/dist/loader.js", "/venice/apps/airbyte/plaid-connector.ts"]
