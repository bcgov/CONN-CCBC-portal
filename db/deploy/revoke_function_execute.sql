-- Deploy ccbc:revoke_function_execute to pg

begin;

alter default privileges revoke execute on functions from public;

commit;
