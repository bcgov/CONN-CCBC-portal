FROM registry.access.redhat.com/ubi9/s2i-base@sha256:bfff3a0f4e4c810903b453517de426fa57e0a5ae8be90364fce3b1299c787dc1

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
ENV APP_HOME=/root
ENV HOME=/root
ARG GIT_HASH
ENV GIT_HASH=${GIT_HASH}
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV UPLOAD_DIR=${APP_HOME}/uploads

WORKDIR ${APP_HOME}

RUN INSTALL_PKGS="yarn-1.22.18-1" && \
  yum -y update && \
  curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo > /etc/yum.repos.d/yarn.repo && \
  rpm --import https://dl.yarnpkg.com/rpm/pubkey.gpg && \
  yum -y install --setopt=tsflags=nodocs $INSTALL_PKGS && \
  rpm -V $INSTALL_PKGS && \
  yum -y clean all --enablerepo='*' && \
  rm -rf /var/cache

# Install asdf package manager
RUN git clone https://github.com/asdf-vm/asdf.git ${APP_HOME}/asdf --branch v0.8.1 && \
  cd ${APP_HOME}/asdf && \
  git checkout v0.8.1
ENV BASH_ENV="${APP_HOME}/asdf/asdf.sh"
# Because asdf is loaded via BASH_ENV, all commands using adsf need to be executed using /usr/bin/env bash -c
SHELL ["/usr/bin/env", "bash", "-c"]

# The app container only needs yarn and node; make sure they're installed
COPY .tool-versions ${APP_HOME}/.tool-versions
RUN sed -i -nr '/node|yarn/p' ${APP_HOME}/.tool-versions && \
  cat ${APP_HOME}/.tool-versions | cut -f 1 -d ' ' | xargs -n 1 asdf plugin-add && \
  asdf plugin-update --all && \
  asdf install && \
  asdf reshim && \
  pushd ${APP_HOME}/.asdf/installs/nodejs/$(awk '/^nodejs/ { print $2 }' .tool-versions)/lib && \
  npm i npm corepack && \
  rm -f package.json package-lock.json && \
  popd

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init
ENTRYPOINT ["dumb-init", "--", "/usr/bin/env", "bash", "-c"]

COPY app/ ${APP_HOME}/

# FIX CVE-2022-29244
RUN rm -rf /usr/local/bin/npm \
  && rm -rf /root/.npm

ENV NODE_ENV=production
ENV ENABLE_ANALYTICS=true

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 CYPRESS_INSTALL_BINARY=0 \
  yarn install --frozen-lockfile --production=false && \
  yarn build:relay && \
  yarn build:server && \
  yarn build:next && \
  yarn install --frozen-lockfile --production=true && \
  yarn cache clean && \
  # Make everything in the home group-writable to support OpenShift's restricted SCC
  # Needs to be done as root to chown
  # same layer as yarn install to keep re-chowned files from using up several hundred MBs more space
  chown -R ${USER_ID}:0 ${APP_HOME} && \
  chmod -R g+rwX ${APP_HOME}

# Create a directory for uploads
RUN mkdir -p ${UPLOAD_DIR} && \
  chown -R ${USER_ID}:0 ${UPLOAD_DIR} && \
  chmod -R g+rw ${UPLOAD_DIR}

EXPOSE 3000 9000
USER ${USER_ID}
WORKDIR ${APP_HOME}

CMD ["yarn start"]
