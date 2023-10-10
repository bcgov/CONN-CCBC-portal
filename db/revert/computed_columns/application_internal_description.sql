-- Revert ccbc:computed_columns/application_internal_description from pg

begin;

drop function if exists ccbc_public.application_internal_description;

commit;
