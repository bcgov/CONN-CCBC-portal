-- deploy ccbc:tables/application_status_type_010_closed_to_not_selected to pg

begin;

update ccbc_public.application_status_type set description = 'Not selected' where name = 'closed';

commit;
