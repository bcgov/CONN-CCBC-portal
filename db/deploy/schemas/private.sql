-- Deploy ccbc:schemas/private to pg
-- requires: create_roles

begin;

create schema if not exists ccbc_private;
grant usage on schema ccbc_private to ccbc_guest, ccbc_auth_user;
comment on schema ccbc_private is 'The private schema for the ccbc.';

commit;

