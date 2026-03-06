# Docker build should be run from parent directory
FROM postgis/postgis:17-3.5-alpine

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

# Install required dependencies and tools
# tzdata + TZ ensure sqitch/perl can resolve local time zone
RUN apk add --no-cache git make gcc musl-dev perl perl-dev perl-utils wget patch tzdata

# Set a deterministic time zone and provide /etc/localtime
ENV TZ=Etc/UTC
RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone

# Install sqitch and DBD::Pg via cpanm (no native Alpine package for sqitch)
RUN apk add --no-cache perl perl-dev make gcc musl-dev postgresql-dev wget \
  && wget -q -O- https://cpanmin.us | perl - --notest App::Sqitch DBD::Pg \
  && apk del perl-dev make gcc musl-dev postgresql-dev wget

COPY db/ ${HOME}
COPY mocks_schema/ ${HOME}/mocks_schema
COPY lib/test/ ${HOME}/test

RUN chown -R ${USER_ID}:0 ${HOME} && chmod -R g+rwX ${HOME}

USER ${USER_ID}
