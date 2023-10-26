# Creating a data dump with pg_dump

## Connecting to pod

Refer to the "Selecting leader pod in OpenShift" in [Process to Manipulate Data](./process_to_manipulate_data.md)

## Creating and downloading the dump

Once you've identified to the leading pod, you'll be in the position to dump the data. Using `oc exec -it <leading pod> -- pg_dump ccbc > backup.sql` will dump both the data and the schema to your local machine with the filename "backup.sql". To only download the data without the schema add `--data-only` after ccbc.

## Restoring Data from the dump

Once you've obtained the `backup.sql` file, you should be able to copy over the data using the following commands.

### Data only

If you've copied the data-only (using `--data-only`), so long as your local DB schema is the same as the one in test you can go ahead and copy the data using `psql -d ccbc < backup.sql`. This will copy over all the data.

### Data and Schema

Assuming you've copied the DB with the schema details, you will need to drop the database first. The simplest way to do this is from the commandline using `dropdb ccbc`, and then recreate the database with `createdb ccbc`. Then you should be able to do the same command with `psql -d ccbc < backup.sql` copying over the schema along with the data.
