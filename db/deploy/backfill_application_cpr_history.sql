-- Deploy ccbc:backfill_application_cpr_history to pg

BEGIN;
do
$do$
begin

    perform ccbc_public.import_application_community_progress_report_records();
    
end
$do$;

COMMIT;
