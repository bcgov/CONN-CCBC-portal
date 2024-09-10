# Stage 1: Build stage with all dependencies
FROM debian:bookworm-slim AS build

# Create directories for the downloaded zip files
RUN mkdir -p /data/zip1 /data/zip2 /data/zip3

# Set the working directory
WORKDIR /data

# Copy entrypoint script into the build stage
COPY cron/shp/entrypoint.sh /usr/local/bin/entrypoint.sh

# Copy SQL folder
COPY cron/shp/sql /data/sql

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Stage 2: Final stage with a smaller image
FROM debian:bookworm-slim

# Install only the required runtime packages
RUN apt-get update && apt-get install -y \
    postgresql-client-15 \
    postgis \
    awscli \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Copy necessary files from the build stage
COPY --from=build /usr/local/bin/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY --from=build /data /data

# Set the entrypoint to the script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
