FROM debian:10

ENV SUMMARY="An image for the CONN-CCBC-portal app" \
    DESCRIPTION="This image contains the compiled CONN-CCBC-portal node app"

LABEL summary="$SUMMARY" \
      description="$DESCRIPTION" \
      io.k8s.description="$DESCRIPTION" \
      io.k8s.display-name="CONN-CCBC-portal" \
      io.openshift.tags="ccbc,node" \
      name="ccbc" \
      version="1" \
      maintainer="Marcel <marcel@button.is>"

RUN apt-get update && \
    apt-get install -y git gnupg curl && \
    apt-get clean

ENV USER_ID=1001
ENV APP_HOME=/root
ENV HOME=/root

WORKDIR ${APP_HOME}

COPY app/ ${APP_HOME}/

RUN git clone https://github.com/asdf-vm/asdf.git ${APP_HOME}/asdf --branch v0.8.1
RUN cd ${APP_HOME}/asdf && git checkout v0.8.1
ENV BASH_ENV="${APP_HOME}/asdf/asdf.sh"
# Because asdf is loaded via BASH_ENV, all commands using adsf need to be executed using /usr/bin/env bash -c
SHELL ["/usr/bin/env", "bash", "-c"]

COPY .tool-versions ${APP_HOME}/.tool-versions
# The app only needs yarn and node
RUN sed -i -nr '/node|yarn/p' ${APP_HOME}/.tool-versions
RUN cat ${APP_HOME}/.tool-versions | cut -f 1 -d ' ' | xargs -n 1 asdf plugin-add
RUN asdf plugin-update --all

RUN asdf install
RUN asdf reshim

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init
ENTRYPOINT ["dumb-init", "--", "/usr/bin/env", "bash", "-c"]

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
    useradd -ms /bin/bash -d ${APP_HOME} --uid ${USER_ID} -g root app && \
    chown -R app:0 ${APP_HOME} && \
    chmod g=u /etc/passwd && \
    chmod -R g+rwX ${APP_HOME}

EXPOSE 3000 9000
USER ${USER_ID}
WORKDIR ${APP_HOME}

CMD ["yarn start"]
