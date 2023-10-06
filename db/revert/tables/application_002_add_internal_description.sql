-- Revert ccbc:application_002_add_internal_description from pg

begin;

alter table ccbc_public.application drop column if exists internal_description;

commit;
