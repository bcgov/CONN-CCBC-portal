-- Revert ccbc:tables/application_merge from pg
begin;

drop table if exists ccbc_public.application_merge;

commit;
