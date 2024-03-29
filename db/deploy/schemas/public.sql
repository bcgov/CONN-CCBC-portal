-- Deploy ccbc:schemas/public to pg
-- requires: create_roles

begin;

create schema if not exists ccbc_public;
grant usage on schema ccbc_public to ccbc_auth_user, ccbc_guest, ccbc_analyst, ccbc_admin, ccbc_job_executor, ccbc_archiver, ccbc_service_account;
comment on schema ccbc_public is 'The public API schema for the ccbc intake.';

commit;
