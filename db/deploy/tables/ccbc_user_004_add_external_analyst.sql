-- Deploy ccbc:tables/ccbc_user_004_add_external_analyst to pg

begin;

alter table ccbc_public.ccbc_user
add column external_analyst boolean default null;

comment on column ccbc_public.ccbc_user.external_analyst is 'User is an external analyst';

commit;
