-- Deploy ccbc:extensions/uuid to pg

BEGIN;

create extension if not exists "uuid-ossp";

COMMIT;
