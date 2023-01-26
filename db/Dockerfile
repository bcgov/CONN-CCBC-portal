# Docker build should be run from parent directory
FROM registry.access.redhat.com/ubi9/s2i-base@sha256:55c5e3b695f56768208a1d20f354bce8a152a27239dc178b99f6bf530b16f155

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

RUN INSTALL_PKGS="postgresql.x86_64 perl-App-cpanminus.noarch" && \
  yum -y update && \
  yum -y install --setopt=tsflags=nodocs $INSTALL_PKGS && \
  rpm -V $INSTALL_PKGS && \
  yum -y clean all --enablerepo='*' && \
  rm -rf /var/cache

COPY db/ ${HOME}
COPY mocks_schema/ ${HOME}/mocks_schema

# CPAN needs to install dependencies for all schemas, one directory up
RUN cpanm --notest --local-lib ./extlib --installdeps .

# CPAN can install scripts. They should be available from mod_perl too.
ENV PATH="$PATH:$HOME/extlib/bin"
# And we have to set Perl include path too because mod_perl's PerlSwitches
# does not apply to them.
ENV PERL5LIB=${HOME}/extlib/lib/perl5

RUN chown -R ${USER_ID}:0 ${HOME} && chmod -R g+rwX ${HOME}

USER ${USER_ID}
