#!/bin/bash

set -euxo pipefail

echo "Deploying application to openshift $*"

cd helm/app
helm dep up
helm upgrade --install --atomic -f ./values.yaml "$@" $1 . --timeout=20m0s
