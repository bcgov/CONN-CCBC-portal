#!/bin/bash

ENV="dev"
NAMESPACE="$LICENSE_PLATE-$ENV"
OUTPUT_DIR="./$ENV"

mkdir -p $OUTPUT_DIR

# Get the list of secret names in the namespace
SECRET_NAMES=$(oc get secrets -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}')

# Create an associative array to store secret data
declare -A SECRET_DATA

# Loop through each secret and store its data in the array
for SECRET_NAME in $SECRET_NAMES; do
    OUTPUT_FILE="$OUTPUT_DIR/$SECRET_NAME.json"
    # Skip secrets that start with "builder" or "sh"
    if [[ "$SECRET_NAME" == builder* || "$SECRET_NAME" == sh* || "$SECRET_NAME" == ccbc-deployer* || "$SECRET_NAME" == ccbc-hippo-ha* || "$SECRET_NAME" == default* || "$SECRET_NAME" == deployer* || "$SECRET_NAME" == ff61fb-vault* || "$SECRET_NAME" == pipeline* || "$SECRET_NAME" == workspace* ]]; then
        echo "Skipping secret: $SECRET_NAME"
        echo ""
        continue
    fi
    echo "Extracting secret: $SECRET_NAME to $OUTPUT_FILE"

    # Get the secret data, decode base64, and create a JSON object
    oc get secret "$SECRET_NAME" -n "$NAMESPACE" -o json |
    jq -r '.data | to_entries | map("\"" + .key + "\": \"" + (.value | @base64d) + "\"") | "{" + join(", ") + "}"' > "$OUTPUT_FILE"

    echo ""
done
