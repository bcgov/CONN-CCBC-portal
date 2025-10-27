# Use the official PostgreSQL 15 image as the base image
FROM postgres:18

# Set environment variables for PostgreSQL
ENV POSTGRES_PASSWORD=mysecretpassword

# Install required dependencies and tools
RUN apt-get update \
    && apt-get install -y git build-essential postgresql-server-dev-15 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Clone pgTap repository from GitHub and install it
RUN git clone https://github.com/theory/pgtap.git /tmp/pgtap \
    && cd /tmp/pgtap \
    && git checkout v1.1.0 \
    && make \
    && make install

# Cleanup temporary files
RUN rm -rf /tmp/pgtap

#install pg_prove
RUN cpan TAP::Parser::SourceHandler::pgTAP

# Expose the PostgreSQL port
EXPOSE 5432

# Start PostgreSQL service
CMD ["postgres"]
