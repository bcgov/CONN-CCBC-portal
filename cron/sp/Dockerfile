
FROM node:23-alpine

ENV SUMMARY="An image for the CCBC SP Cronjob" \
    DESCRIPTION="This image contains the script to run on an OpenShift Cronjob"

LABEL summary="$SUMMARY" \
    description="$DESCRIPTION" \
    io.k8s.description="$DESCRIPTION" \
    io.k8s.display-name="ghcr.io/bcgov/conn-ccbc-portal/ccbc-cron-sp" \
    io.openshift.tags="ccbc,node,sp" \
    name="ccbc-cron-sp" \
    vendor="Province of British Columbia" \
    maintainer="Romer, Meherzad CITZ:EX <Meherzad.Romer@gov.bc.ca>"

ENV USER_ID=1001
ENV APP_HOME=/root
ENV HOME=/root

WORKDIR ${APP_HOME}

COPY cron/sp/ ${APP_HOME}

RUN chown -R ${USER_ID}:0 ${APP_HOME} && \
    chmod -R g+rwX ${APP_HOME}

USER ${USER_ID}
WORKDIR ${APP_HOME}

CMD ["node", "app.mjs"]
