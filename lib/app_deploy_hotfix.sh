#!/bin/bash

set -euxo pipefail

echo "Deploying application to openshift $*"

cd helm/hotfix
helm dep up
helm upgrade --install --rollback-on-failure -f ./values.yaml "$@" ccbc-hotfix . --timeout=20m0s
