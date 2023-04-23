-- Deploy mocks:schemas/main to pg

begin;

create schema if not exists mocks;
grant usage on schema mocks to ccbc_auth_user, ccbc_guest;

comment on schema mocks is 'A schema for mock functions that can be used for either tests or dev/test environments';

commit;
