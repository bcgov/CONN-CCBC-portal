-- Revert ccbc:mutations/create_application_milestone_data from pg

begin;

drop function if exists ccbc_public.create_application_milestone_data cascade;

commit;
