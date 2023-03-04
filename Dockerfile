FROM node:18-alpine as base

RUN npm install -g pnpm

FROM base as dependencies

WORKDIR /venice

COPY tsconfig.json package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./patches/ ./patches
COPY ./apps/ ./apps
COPY ./packages/ ./packages
COPY ./integrations/ ./integrations

RUN pnpm install

ENTRYPOINT ["node",  "--no-warnings", "--loader", "/venice/node_modules/tsx/dist/loader.js", "/venice/apps/airbyte/airbyte-connector.ts"]
