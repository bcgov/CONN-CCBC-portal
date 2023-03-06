-- Deploy ccbc:backfill_history to pg

BEGIN;
do
$do$
begin
    -- run only once
    if 0 = (select count(*) from ccbc_public.record_version where table_name='application_analyst_lead') then
        perform ccbc_public.import_applications();
        perform ccbc_public.import_attachments() ;
        perform ccbc_public.import_application_statuses();
        perform ccbc_public.import_assessment_data();
        perform ccbc_public.import_rfi_data();
        perform ccbc_public.import_form_data();
        perform ccbc_public.import_application_analyst_lead();
        perform ccbc_public.import_application_package();

    end if;
    
end
$do$;

COMMIT;
