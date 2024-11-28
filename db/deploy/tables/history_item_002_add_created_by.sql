-- Deploy ccbc:tables/history_item_002_add_created_by to pg

begin;

alter table ccbc_public.history_item
add column created_by int;

comment on column ccbc_public.history_item.created_by is 'User id that triggered this operation';

commit;
