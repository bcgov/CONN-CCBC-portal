-- Revert ccbc:revoke_function_execute from pg

begin;

alter default privileges grant execute on functions from public;

commit;
