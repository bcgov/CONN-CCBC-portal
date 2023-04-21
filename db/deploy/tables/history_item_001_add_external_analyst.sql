-- Deploy ccbc:tables/history_item_001_add_external_analyst to pg

begin;

alter table ccbc_public.history_item
add column external_analyst boolean;

comment on column ccbc_public.history_item.external_analyst is 'User is an external analyst';

commit;
