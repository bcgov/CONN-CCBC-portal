-- Revert ccbc:tables/application_status_type_011_add_merged_status from pg
BEGIN;

delete from ccbc_public.application_status_type where name in ('merged', 'applicant_merged');

update ccbc_public.application_status_type set status_order = 18 where name = 'applicant_approved';
update ccbc_public.application_status_type set status_order = 19 where name = 'approved';
update ccbc_public.application_status_type set status_order = 20 where name = 'applicant_complete';

COMMIT;
