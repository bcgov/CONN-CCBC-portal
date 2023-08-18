-- Revert ccbc:mutations/create_project_information from pg

begin;

drop function ccbc_public.create_project_information;

commit;
