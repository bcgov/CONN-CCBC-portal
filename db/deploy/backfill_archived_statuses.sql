-- Deploy ccbc:backfill_archived_statuses to pg

BEGIN;
do
$do$
begin

    perform ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_status', true, false,true);
    perform ccbc_public.set_application_status_archived();
    
end
$do$;

COMMIT;