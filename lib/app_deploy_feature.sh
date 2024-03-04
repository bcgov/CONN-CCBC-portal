#!/bin/bash

set -euxo pipefail

echo "Deploying application to openshift $*"

cd helm/feature
helm dep up
helm upgrade --install --atomic -f ./values.yaml "$@" . --timeout=20m0s
