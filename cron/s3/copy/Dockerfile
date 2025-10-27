# Start from a lightweight Python base
FROM python:3.14-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY cron/s3/copy/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy script
COPY cron/s3/copy/copy_buckets.py .

# Run script on container start
CMD ["python", "copy_buckets.py"]
