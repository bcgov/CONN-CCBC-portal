#!/bin/bash

usage() {
    echo "Usage: $0 <helm_release_name> <openshift_namespace> <slot_count>"
    echo "Example: $0 ndt-1234-my-feature abc123-dev 20"
    exit 1
}

if [ $# -ne 3 ]; then
    usage
fi

RELEASE_NAME=$1
OPENSHIFT_NAMESPACE=$2
SLOT_COUNT=$3

SLOT_PREFIX="ccbc-pr-"
SLOT_DOMAIN="apps.silver.devops.gov.bc.ca"

EXISTING_HOST=$(oc -n "$OPENSHIFT_NAMESPACE" get route "$RELEASE_NAME" -o=jsonpath='{.spec.host}' 2>/dev/null)

# Redeploys of an open PR keep the slot they already hold, so the feature
# URL stays stable for the life of the PR lives.
if [ -n "$EXISTING_HOST" ]; then
    echo "$RELEASE_NAME is already routed at $EXISTING_HOST" >&2
    echo "$EXISTING_HOST"
    exit 0
fi

TAKEN_HOSTS=$(oc -n "$OPENSHIFT_NAMESPACE" get routes -o=jsonpath='{range .items[*]}{.spec.host}{"\n"}{end}')

for (( slot=0; slot<SLOT_COUNT; slot++ )); do
    CANDIDATE="${SLOT_PREFIX}${slot}.${SLOT_DOMAIN}"
    if ! echo "$TAKEN_HOSTS" | grep -qxF "$CANDIDATE"; then
        echo "Assigning $CANDIDATE to $RELEASE_NAME" >&2
        echo "$CANDIDATE"
        exit 0
    fi
done

echo "No free feature slot: all $SLOT_COUNT slots are in use." >&2
echo "Close a feature PR to release one, or add another slot hostname to the" >&2
echo "Dev integration in the SSO CSS console and raise slot_count to match." >&2
echo "Slot hostnames currently routed in $OPENSHIFT_NAMESPACE:" >&2
echo "$TAKEN_HOSTS" | grep -F "$SLOT_PREFIX" >&2
exit 1
