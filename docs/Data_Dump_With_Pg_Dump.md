# Creating a data dump with pg_dump

## Connecting to pod

Refer to the "Selecting leader pod in OpenShift" in [Process to Manipulate Data](./process_to_manipulate_data.md)

## Creating and downloading the dump

Once you've identified to the leading pod, you'll be in the position to dump the data. Using `kubectl exec -it <leading pod> -- /usr/pgsql-14/bin/pg_dump ccbc > backup.sql` will dump both the data and the schema to your local machine with the filename "backup.sql". To only download the data without the schema add `--data-only` after ccbc.

If you encounter trouble, it may be because the location/version of postgres has changed, in which case connect to the leading pod using `kubectl exec -it <leading pod> -- /bin/sh` and run the command `which pg_dump` to find the path of pg_dump
