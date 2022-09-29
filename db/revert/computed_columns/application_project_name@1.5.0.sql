-- Revert ccbc:computed_columns/application_project_name from pg

begin;

drop function ccbc_public.application_project_name;

commit;
