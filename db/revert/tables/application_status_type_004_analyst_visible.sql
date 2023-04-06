-- Revert ccbc:tables/application_status_type_004_analyst_visible from pg

begin;

alter table ccbc_public.application_status_type drop column visible_by_analyst;

commit;
