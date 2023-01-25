-- revert ccbc:tables/application_status_type_003_status_order from pg

begin;

alter table ccbc_public.application_status_type drop column status_order;

commit;
