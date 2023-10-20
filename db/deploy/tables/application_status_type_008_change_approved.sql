-- Deploy ccbc:tables/application_status_type_008_change_approved to pg

begin;

update ccbc_public.application_status_type set description = 'Agreement Signed' where name = 'approved';

commit;
