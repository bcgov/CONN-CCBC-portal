-- Deploy ccbc:backfill_history to pg

BEGIN;
do
$do$
begin
    -- run only once
    if exists (select true from pg_proc where proname='import_once') then
        select ccbc_public.import_applications();
        select ccbc_public.import_attachments() ;
        select ccbc_public.import_application_statuses();
        select ccbc_public.import_assessment_data();
        select ccbc_public.import_rfi_data();
        drop function ccbc_public.import_once;
    end if;
end
$do$;

COMMIT;
