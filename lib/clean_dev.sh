#!/bin/bash

usage() {
    echo "Usage: $0 <openshift_namespace>"
    exit 1
}

if [ $# -ne 1 ]; then
    usage
fi

# Delete failed jobs excluding those starting with ccbc-repo2 or ccbc-pgbackrest
oc -n $1 get jobs -o json | jq -r '.items[] | select(.status.failed > 0 and (.metadata.name | test("^ccbc-repo2") | not) and (.metadata.name | test("^ccbc-pgbackrest") | not)) | .metadata.name' | xargs -I{} oc -n $1 delete job {}

# Delete succeeded jobs excluding those starting with ccbc-repo2 or ccbc-pgbackrest
oc -n $1 get jobs -o json | jq -r '.items[] | select(.status.succeeded > 0 and (.metadata.name | test("^ccbc-repo2") | not) and (.metadata.name | test("^ccbc-pgbackrest") | not)) | .metadata.name' | xargs -I{} oc -n $1 delete job {}
