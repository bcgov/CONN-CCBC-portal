-- Revert ccbc:tables/application_internal_description from pg

begin;

drop table if exists ccbc_public.application_internal_description;

commit;
