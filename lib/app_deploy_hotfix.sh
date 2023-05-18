#!/bin/bash

set -euxo pipefail

echo "Deploying application to openshift $*"

cd helm/hotfix
helm dep up
helm upgrade --install --atomic -f ./values.yaml "$@" ccbc . --timeout=20m0s
