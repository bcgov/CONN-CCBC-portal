#!/bin/bash

usage() {
    echo "Usage: $0 <openshift_namespace>"
    exit 1
}

if [ $# -ne 1 ]; then
    usage
fi

# Delete all failed jobs
oc -n $1 get jobs -o json | jq -r '.items[] | select(.status.failed > 0) | .metadata.name' | xargs -I{} oc -n $1 delete job {}

# Delete all succeeded jobs
oc -n $1 get jobs -o json | jq -r '.items[] | select(.status.succeeded > 0) | .metadata.name' | xargs -I{} oc -n $1 delete job {}
