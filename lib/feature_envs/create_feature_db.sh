#!/bin/bash

usage() {
    echo "Usage: $0 <pg_cluster_name> <new_database_name> <openshift_namespace>"
    echo "Example: $0 my-pg-cluser new-feature-name abc123-dev"
    exit 1
}

if [ $# -ne 3 ]; then
    usage
fi

# Set the name of the PostgreSQL cluster
PG_CLUSTER_NAME=$1

# Retrieve the current list of users and their databases from the Custom Resource
USERS=$(oc -n $3 get PostgresCluster "$PG_CLUSTER_NAME" -o=jsonpath='{.spec.users[*]}')

# Set the new database name to add
# it must match what is set at the Helm level
DB_NAME_LOWER=$(echo $2 | tr '[:upper:]' '[:lower:]')
NEW_DATABASE_NAME=$(echo $DB_NAME_LOWER | cut -c -30)

# Flag to track if the new database name is found in any user
DATABASE_FOUND=0

# Iterate over each user to check if the new database name is present
while IFS= read -r user; do
    databases=$(echo "$user" | jq -r '.databases[]')
    if echo "$databases" | grep -qw "$NEW_DATABASE_NAME"; then
        DATABASE_FOUND=1
        break
    fi
done <<< "$USERS"

# If the database is found, exit with a success status
if [ "$DATABASE_FOUND" -eq 1 ]; then
    echo "Nothing to do: $NEW_DATABASE_NAME is already present."
    exit 0
fi

# Initialize an empty array for storing the patched users
PATCHED_USERS=()

# Loop through each user and construct the patch content
for user in $USERS; do
    name=$(echo "$user" | jq -r '.name')
    databases=$(echo "$user" | jq -r '.databases')
    patched_databases=$(echo "$databases" | jq '. += ["'$NEW_DATABASE_NAME'"]')
    PATCHED_USERS+=("{\"name\":\"$name\",\"databases\":$patched_databases}")
done

# Join patched users with commas
PATCHED_USERS_JOINED=$(IFS=,; echo "${PATCHED_USERS[*]}")

# Construct the patch content
PATCH_CONTENT="{\"spec\":{\"users\":[$PATCHED_USERS_JOINED]}}"

# Set the OpenShift Namespace
OPENSHIFT_NAMESPACE=$3

# Patch the Custom Resource
oc -n $3 patch PostgresCluster "$PG_CLUSTER_NAME" --type=merge --patch="$PATCH_CONTENT"

# Give the cluster 15 seconds to create the new database
sleep 15
