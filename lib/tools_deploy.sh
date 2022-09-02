#!/bin/bash

set -euxo pipefail

echo "Deploying application tools to openshift $*"

cd helm/tools
helm dep up
helm upgrade --install --atomic -f ./values.yaml "$@" ccbc-tools .
