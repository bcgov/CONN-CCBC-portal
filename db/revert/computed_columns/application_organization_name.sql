-- Revert ccbc:computed_columns/application_organization_name from pg

begin;

drop function ccbc_public.application_organization_name;

commit;
