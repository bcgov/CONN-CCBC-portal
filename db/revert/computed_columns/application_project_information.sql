-- Revert ccbc:computed_columns/application_project_information from pg

begin;

drop function ccbc_public.application_project_information;

commit;
