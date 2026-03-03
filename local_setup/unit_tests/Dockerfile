# Use the PostGIS image to ensure geometry types are available
FROM postgis/postgis:17-3.5-alpine

# Set environment variables for PostgreSQL
ENV POSTGRES_PASSWORD=mysecretpassword

# Install required dependencies and tools
RUN apk add --no-cache git make gcc musl-dev perl perl-dev perl-utils wget patch

# Clone pgTap repository from GitHub and install it
RUN git clone https://github.com/theory/pgtap.git /tmp/pgtap \
    && cd /tmp/pgtap \
    && git checkout v1.3.4 \
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
