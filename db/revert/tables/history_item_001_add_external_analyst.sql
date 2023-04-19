-- Revert ccbc:tables/history_item_001_add_external_analyst from pg

begin;

alter table ccbc_public.history_item drop column external_analyst;

commit;
