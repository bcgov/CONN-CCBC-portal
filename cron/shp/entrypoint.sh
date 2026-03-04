#!/bin/bash
set -e

echo "Checking if a coverages upload has been uploaded since last run"

# Get the last modified dates from AWS S3 for both coverage files
coverages_last_modified=$(aws s3api head-object --bucket $AWS_BUCKET_NAME --key $COVERAGES_FILE --query 'LastModified' --output text)
echo "Last modified date of $COVERAGES_FILE: $coverages_last_modified"
coverages_last_modified_epoch=$(date -d "$coverages_last_modified" +%s)

cbc_coverage_last_modified=$(aws s3api head-object --bucket $AWS_BUCKET_NAME --key $CBC_COVERAGE_FILE_NAME --query 'LastModified' --output text)
echo "Last modified date of $CBC_COVERAGE_FILE_NAME: $cbc_coverage_last_modified"
cbc_coverage_last_modified_epoch=$(date -d "$cbc_coverage_last_modified" +%s)

# Use the most recent modified date of the two files
if [[ "$coverages_last_modified_epoch" -gt "$cbc_coverage_last_modified_epoch" ]]; then
    last_modified_epoch=$coverages_last_modified_epoch
else
    last_modified_epoch=$cbc_coverage_last_modified_epoch
fi

# Check the latest record's date in the ccbc_public.application_er table
latest_record_date=$(psql -d $DB_NAME -t -c "SELECT created_at FROM ccbc_public.application_er LIMIT 1")

echo "Latest record date in ccbc_public.application_er table: $latest_record_date"

# Convert latest record date to a comparable format
latest_record_date_epoch=$(date -d "$latest_record_date" +%s)

# Compare the dates — proceed if either coverage file is newer than the last run
if [[ "$last_modified_epoch" -gt "$latest_record_date_epoch" ]]; then
    echo "Downloading and unzipping shapefiles from AWS S3..."
    # Download zip files from AWS S3 using the environment variable AWS_BUCKET_NAME
    aws s3 cp s3://$AWS_BUCKET_NAME/$ER_FILE /data/$ER_FILE
    aws s3 cp s3://$AWS_BUCKET_NAME/$RD_FILE /data/$RD_FILE
    aws s3 cp s3://$AWS_BUCKET_NAME/$COVERAGES_FILE /data/$COVERAGES_FILE
    aws s3 cp s3://$AWS_BUCKET_NAME/$CBC_COVERAGE_FILE_NAME /data/$CBC_COVERAGE_FILE_NAME

    # Unzip each file into its corresponding directory
    unzip /data/$ER_FILE -d /data/economic_regions
    unzip /data/$RD_FILE -d /data/regional_districts
    unzip /data/$COVERAGES_FILE -d /data/ccbc_applications_coverages
    unzip /data/$CBC_COVERAGE_FILE_NAME -d /data/cbc_coverage

    echo "Creating dummy tables"
    # Create the dummy tables so that the shp2pgsql command can run
    psql -d $DB_NAME -c "
    CREATE TABLE IF NOT EXISTS ccbc_public.economic_regions (
        id SERIAL PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS ccbc_public.regional_districts (
        id SERIAL PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS ccbc_public.ccbc_applications_coverages (
        id SERIAL PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS ccbc_public.cbc_transport (
        id SERIAL PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS ccbc_public.cbc_lastmile_coverage (
        id SERIAL PRIMARY KEY
    );

    DROP VIEW ccbc_public.cbc_last_mile_coverage_geojson;
    DROP VIEW ccbc_public.cbc_transports_geojson;
    "

    echo "Running shp2pgsql and sql scripts..."
    # Run shp2pgsql for each shapefile
    for dir in /data/economic_regions /data/regional_districts /data/ccbc_applications_coverages; do
        base_dir=$(basename $dir)
        for shp in $dir/*.shp; do
            shp2pgsql -d -I -s 4326 $shp $SCHEMA_NAME.$base_dir | psql -d $DB_NAME
        done
    done

    # Process CBC Coverage shapefiles (each subfolder has its own .shp)
    for dir in /data/cbc_coverage/CBC_Transport /data/cbc_coverage/CBC_LastMile_Coverage; do
        base_dir=$(basename $dir)
        table_name=$(echo $base_dir | tr '[:upper:]' '[:lower:]')
        for shp in $dir/*.shp; do
            shp2pgsql -d -I -s 4326 $shp $SCHEMA_NAME.$table_name | psql -d $DB_NAME
        done
    done

    # Execute the sql scripts
    for sql in /data/sql/*.sql; do
        psql -d $DB_NAME -f $sql
    done

    # Clean up zip files after processing
    rm /data/$ER_FILE /data/$RD_FILE /data/$COVERAGES_FILE /data/$CBC_COVERAGE_FILE_NAME
else
  echo "No newer coverages upload found. Exiting."
fi
