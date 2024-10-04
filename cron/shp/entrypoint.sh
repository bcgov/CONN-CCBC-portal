#!/bin/bash
set -e

echo "Downloading and unzipping shapefiles from AWS S3..."
# Download zip files from AWS S3 using the environment variable AWS_BUCKET_NAME
aws s3 cp s3://$AWS_BUCKET_NAME/$ER_FILE /data/$ER_FILE
aws s3 cp s3://$AWS_BUCKET_NAME/$RD_FILE /data/$RD_FILE
aws s3 cp s3://$AWS_BUCKET_NAME/$COVERAGES_FILE /data/$COVERAGES_FILE

# Unzip each file into its corresponding directory
unzip /data/$ER_FILE -d /data/economic_regions
unzip /data/$RD_FILE -d /data/regional_districts
unzip /data/$COVERAGES_FILE -d /data/ccbc_applications_coverages

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
"

echo "Running shp2pgsql and sql scripts..."
# Run shp2pgsql for each shapefile
for dir in /data/economic_regions /data/regional_districts /data/ccbc_applications_coverages; do
    base_dir=$(basename $dir)
    for shp in $dir/*.shp; do
        shp2pgsql -d -I -s 4326 $shp $SCHEMA_NAME.$base_dir | psql -d $DB_NAME
    done
done

# Execute the sql scripts
for sql in /data/sql/*.sql; do
    psql -d $DB_NAME -f $sql
done

# Clean up zip files after processing
rm /data/$ER_FILE /data/$RD_FILE /data/$COVERAGES_FILE
