# Docker build should be run from parent directory
FROM postgres:18-bookworm

ENV SUMMARY="DB Schema for bcgov/CONN-CCBC-portal" \
  DESCRIPTION="Sqitch migrations for the accompanying app container image"

LABEL summary="$SUMMARY" \
  description="$DESCRIPTION" \
  io.k8s.description="$DESCRIPTION" \
  io.k8s.display-name="ghcr.io/bcgov/conn-ccbc-portal/ccbc-db" \
  io.openshift.tags="ccbc,psql,sqitch,migration" \
  name="ccbc-db" \
  vendor="Province of British Columbia" \
  maintainer="Romer, Meherzad CITZ:EX <Meherzad.Romer@gov.bc.ca>"

ENV USER_ID=1001
ENV HOME=/opt/app-root/src
WORKDIR ${HOME}

# Install required dependencies and sqitch
RUN apt-get update \
  && apt-get install -y sqitch libdbd-pg-perl \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY db/ ${HOME}
COPY mocks_schema/ ${HOME}/mocks_schema
COPY lib/test/ ${HOME}/test

RUN chown -R ${USER_ID}:0 ${HOME} && chmod -R g+rwX ${HOME}

USER ${USER_ID}
