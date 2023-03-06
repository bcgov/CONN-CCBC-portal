-- Deploy ccbc:backfill_history to pg

BEGIN;
do
$do$
begin
    -- run only once
    if exists (select true from pg_proc where proname='import_once') then
        perform ccbc_public.import_applications();
        perform ccbc_public.import_attachments() ;
        perform ccbc_public.import_application_statuses();
        perform ccbc_public.import_assessment_data();
        perform ccbc_public.import_rfi_data();
        drop function ccbc_public.import_once;
    end if;
    
end
$do$;

COMMIT;
