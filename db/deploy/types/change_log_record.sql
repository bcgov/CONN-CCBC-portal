-- Deploy ccbc:types/change_log_record to pg

begin;

create type ccbc_public.change_log_record as (
    id             bigint,
    record_id      uuid,
    old_record_id  uuid,
    op             audit.operation,
    ts             timestamptz,
    table_oid      oid,
    table_schema   name,
    table_name     name,
    created_by     int,
    created_at     timestamptz,
    ccbc_number    varchar(12),
    application_id int,
    program        text,
    record         jsonb,
    old_record     jsonb
);

commit;
