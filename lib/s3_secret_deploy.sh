#!/bin/bash

set -euxo pipefail

echo "Deploying secret to openshift $*"

cd helm/s3-backup
helm dep up
helm upgrade --install --rollback-on-failure -f ./values.yaml "$@" ccbc-s3-backup . --timeout=20m0s
