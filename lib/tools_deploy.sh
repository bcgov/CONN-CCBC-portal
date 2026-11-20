#!/bin/bash

set -euxo pipefail

echo "Deploying application tools to openshift $*"

cd helm/tools
helm dep up
helm upgrade --install --rollback-on-failure -f ./values.yaml "$@" ccbc-tools .
