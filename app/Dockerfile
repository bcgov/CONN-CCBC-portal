# Base stage to install global dependencies
FROM node:20-alpine AS base

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

# Environment variables
ENV USER_ID=1001
ENV APP_HOME=/application
ENV UPLOAD_DIR=${APP_HOME}/uploads

WORKDIR ${APP_HOME}

# Install system dependencies
RUN apk add libc6-compat

# 1ST STAGE: INSTALL ALL DEPENDENCIES NEEDED FOR BUILD --

# Install both dev and prod dependencies during build
FROM base AS deps

# Copy only package.json yarn.lock and the patches for caching purposes
COPY app/package.json .
COPY app/yarn.lock .
COPY app/patches patches

# Install all dependencies (including dev) to ensure build tools are available
RUN yarn --frozen-lockfile

# -- END OF 1ST STAGE --

# -- 2ND STAGE: BUILD THE APP --

# Build the app
FROM base AS builder

# Copy node_modules from the deps stage
COPY --from=deps ${APP_HOME}/node_modules ./node_modules

# Copy the application source code
COPY app/ .

# Remove test folder
RUN rm -rf ${APP_HOME}/tests

# Build the app (compile Relay, server, and Next.js)
ENV NODE_ENV=production
RUN yarn build:relay && yarn build:server && yarn build:next

# -- END OF 2ND STAGE --

# -- 3RD STAGE: PRODUCTION DEPENDENCIES --

# Separate stage for production dependencies to leverage Docker caching
FROM base AS prod-deps

# Copy only package.json yarn.lock and the patches for caching purposes
COPY app/package.json .
COPY app/yarn.lock .
COPY app/patches patches

# Install only production dependencies so this layer can be cached separately
RUN yarn install --frozen-lockfile --production=true --prefer-offline

# -- END OF 3RD STAGE --

# -- FINAL STAGE --
# Production image to run the application
FROM node:20-alpine AS runner

# Env variables for the final image
ENV APP_HOME=/application
ENV UPLOAD_DIR=${APP_HOME}/uploads
ENV USER_ID=1001
ENV NODE_ENV=production

WORKDIR ${APP_HOME}

# Create a non-root user for OCP
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/public ./public
COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/.next ./.next
COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/.persisted_operations ./.persisted_operations
COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/config ./config
COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/schema ./schema
COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/*.json5 .
COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/*.ts .
COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/*.js .
COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/*.properties .
COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/*.json .
COPY --from=builder --chown=${USER_ID}:0 ${APP_HOME}/dist ./dist

# Copy production dependencies
COPY --from=prod-deps --chown=${USER_ID}:0 ${APP_HOME}/node_modules ./node_modules

# Make sure uploads directory has proper permission
RUN mkdir -p ${UPLOAD_DIR} && \
  chown -PR ${USER_ID}:0 ${UPLOAD_DIR} && \
  chmod -R g+rw ${UPLOAD_DIR}

# Run as the non-root user
USER ${USER_ID}

# Expose ports
EXPOSE 3000 9000

# Command to run the application
CMD ["node", "--unhandled-rejections=strict", "--enable-network-family-autoselection", "dist/server.js"]
