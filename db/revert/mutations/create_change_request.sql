-- Revert ccbc:mutations/create_change_request from pg

begin;

drop function ccbc_public.create_project_information;

commit;
