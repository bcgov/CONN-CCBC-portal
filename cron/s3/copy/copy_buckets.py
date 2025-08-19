import boto3
import os

# Read from environment variables
SOURCE_KEY = os.environ["SOURCE_AWS_ACCESS_KEY_ID"]
SOURCE_SECRET = os.environ["SOURCE_AWS_SECRET_ACCESS_KEY"]
SOURCE_REGION = os.getenv("SOURCE_AWS_REGION", "ca-central-1")
SOURCE_BUCKET = os.environ["SOURCE_BUCKET"]

DEST_KEY = os.environ["DEST_AWS_ACCESS_KEY_ID"]
DEST_SECRET = os.environ["DEST_AWS_SECRET_ACCESS_KEY"]
DEST_REGION = os.getenv("DEST_AWS_REGION", "ca-central-1")
DEST_BUCKET = os.environ["DEST_BUCKET"]

# Source session
source_session = boto3.Session(
    aws_access_key_id=SOURCE_KEY,
    aws_secret_access_key=SOURCE_SECRET,
    region_name=SOURCE_REGION,
)
source_s3 = source_session.client("s3")

# Destination session
dest_session = boto3.Session(
    aws_access_key_id=DEST_KEY,
    aws_secret_access_key=DEST_SECRET,
    region_name=DEST_REGION,
)
dest_s3 = dest_session.client("s3")

# Copy objects
paginator = source_s3.get_paginator("list_objects_v2")
for page in paginator.paginate(Bucket=SOURCE_BUCKET):
    for obj in page.get("Contents", []):
        key = obj["Key"]
        print(f"Copying {key}...")

        response = source_s3.get_object(Bucket=SOURCE_BUCKET, Key=key)
        body = response["Body"]

        dest_s3.upload_fileobj(body, DEST_BUCKET, key)

print("✅ Bucket copy complete")
