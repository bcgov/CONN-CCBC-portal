#!/bin/bash

set -euxo pipefail

echo "Deploying application to openshift $*"

cd helm/app
helm dep up
helm upgrade --install --rollback-on-failure -f ./values.yaml "$@" ccbc . --timeout=20m0s
