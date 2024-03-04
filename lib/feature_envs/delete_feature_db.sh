#!/bin/bash

usage() {
    echo "Usage: $0 <pg_cluster_name> <new_database_name> <openshift_namespace>"
    echo "Example: $0 my-pg-cluser new-feature-name abc123-dev"
    exit 1
}

if [ $# -ne 3 ]; then
    usage
fi

# Set the database to remove
# it must match to what was created on create_feature_db.sh
DB_NAME_LOWER=$(echo $2 | tr '[:upper:]' '[:lower:]')
DATABASE_TO_REMOVE=$(echo $DB_NAME_LOWER | cut -c -30)

# First delete the database from the cluster

# Get the lead pod
POD_NAME=$(oc -n $3 get pods -l postgres-operator.crunchydata.com/role=master -o=jsonpath='{.items[0].metadata.name}')

# Execute the drop database command against the PostgreSQL pod
oc exec $POD_NAME -- sh -c "psql -U postgres -c 'DROP DATABASE IF EXISTS \"$DATABASE_TO_REMOVE\";'"

# Then remove the database from the PostgresCluster resource
# as per the docs: https://access.crunchydata.com/documentation/postgres-operator/5.0.1/tutorial/user-management/

# Set the name of the PostgreSQL cluster
PG_CLUSTER_NAME=$1

# Retrieve the current list of users and their databases from the Custom Resource
USERS=$(oc -n $3 get PostgresCluster "$PG_CLUSTER_NAME" -o=jsonpath='{.spec.users[*]}')

# Initialize an empty array for storing the patched users
PATCHED_USERS=()

# Loop through each user and construct the patch content
for user in $USERS; do
    name=$(echo "$user" | jq -r '.name')
    databases=$(echo "$user" | jq -r '.databases')
    # Remove the specified database from the list
    patched_databases=$(echo "$databases" | jq --arg db "$DATABASE_TO_REMOVE" 'map(select(. != $db))')
    PATCHED_USERS+=("{\"name\":\"$name\",\"databases\":$patched_databases}")
done

# Construct the patch content
PATCH_CONTENT='{"spec":{"users":['$(IFS=,; echo "${PATCHED_USERS[*]}")']}}'

# Set the OpenShift Namespace
OPENSHIFT_NAMESPACE=$3

# Patch the Custom Resource
oc -n $3 patch PostgresCluster "$PG_CLUSTER_NAME" --type=merge --patch="$PATCH_CONTENT"
