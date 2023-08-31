#!/bin/bash

# Path in Vault for secrets, options are cubbyhole, nonprod and prod
vault_path="$LICENSE_PLATE-nonprod/backups/"

# Directory containing JSON files
json_dir="./dev"

# Loop through JSON files in the directory
for json_file in "$json_dir"/*.json; do
  secret_name=$(basename "$json_file" .json)
  json_content=$(cat "$json_file")


  # Write the secret to Vault
  echo "$json_content" | vault kv put "$vault_path/$secret_name" -
  if [ $? -eq 0 ]; then
    echo "Secret $secret_name created in $vault_path"
  else
    echo "Failed to create secret $secret_name"
  fi
done

echo "Done"
