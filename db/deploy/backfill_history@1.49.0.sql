-- Deploy ccbc:backfill_history to pg

BEGIN;
do
$do$
begin

    ALTER TABLE ccbc_public.application DISABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.application_status DISABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.attachment DISABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.assessment_data DISABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.rfi_data DISABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.form_data DISABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.application_analyst_lead DISABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.application_package DISABLE TRIGGER _100_timestamps;

    perform ccbc_public.import_applications();
    perform ccbc_public.import_attachments() ;
    perform ccbc_public.import_application_statuses();
    perform ccbc_public.import_assessment_data();
    perform ccbc_public.import_rfi_data();
    perform ccbc_public.import_form_data();
    perform ccbc_public.import_application_analyst_lead();
    perform ccbc_public.import_application_packages();

    ALTER TABLE ccbc_public.application ENABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.application_status ENABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.attachment ENABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.assessment_data ENABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.rfi_data ENABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.form_data ENABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.application_analyst_lead ENABLE TRIGGER _100_timestamps;
    ALTER TABLE ccbc_public.application_package ENABLE TRIGGER _100_timestamps;
    
end
$do$;

COMMIT;
