-- Revert ccbc:tables/application_status_type_008_change_approved from pg

begin;

update ccbc_public.application_status_type set description = 'Approved' where name = 'approved';

update ccbc_public.application_status_type set description = 'Approved' where name = 'applicant_approved';

commit;
