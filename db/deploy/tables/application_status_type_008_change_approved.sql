-- Deploy ccbc:tables/application_status_type_008_change_approved to pg

begin;

update ccbc_public.application_status_type set description = 'Agreement signed' where name = 'approved';
update ccbc_public.application_status_type set description = 'Agreement signed' where name = 'applicant_approved';

commit;
