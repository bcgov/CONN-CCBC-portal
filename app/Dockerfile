FROM node:18-alpine AS base

ENV SUMMARY="An image for the CONN-CCBC-portal app" \
  DESCRIPTION="This image contains the compiled CONN-CCBC-portal node app"

LABEL summary="$SUMMARY" \
  description="$DESCRIPTION" \
  io.k8s.description="$DESCRIPTION" \
  io.k8s.display-name="ghcr.io/bcgov/conn-ccbc-portal/ccbc-app" \
  io.openshift.tags="ccbc,node" \
  name="ccbc-app" \
  vendor="Province of British Columbia" \
  maintainer="Romer, Meherzad CITZ:EX <Meherzad.Romer@gov.bc.ca>"

ENV USER_ID=1001
ENV APP_HOME=/application
#ENV HOME=/root
ARG GIT_HASH
ENV GIT_HASH=${GIT_HASH}
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV UPLOAD_DIR=${APP_HOME}/uploads

WORKDIR ${APP_HOME}

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR ${APP_HOME}
COPY app/package.json .
COPY app/yarn.lock .

RUN yarn --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR ${APP_HOME}
COPY --from=deps ${APP_HOME}/node_modules ./node_modules
COPY app/ .
# This will do the trick, use the corresponding env file for each environment.
RUN yarn build:relay && yarn build:server && yarn build:next

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR ${APP_HOME}

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder ${APP_HOME}/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
#COPY --from=builder --chown=nextjs:nodejs ${APP_HOME}/.next/ ./
#COPY --from=builder --chown=nextjs:nodejs ${APP_HOME}/.next/static ./.next/static
#COPY --from=builder --chown=nextjs:nodejs ${APP_HOME}/dist ./dist
COPY --from=builder --chown=${USER_ID}:0 --chmod=g+rwX ${APP_HOME} ./

USER ${USER_ID}

EXPOSE 3000 9000

CMD node --unhandled-rejections=strict --enable-network-family-autoselection dist/server.js
