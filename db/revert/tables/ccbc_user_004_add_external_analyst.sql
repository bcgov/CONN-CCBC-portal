-- Revert ccbc:tables/ccbc_user_004_add_external_analyst from pg

begin;

alter table ccbc_public.ccbc_user drop column external_analyst;

commit;
