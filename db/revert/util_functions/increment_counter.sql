-- Revert ccbc:util_functions/increment_counter from pg

begin;

drop function if exists ccbc_public.increment_counter(regclass, int);

commit;
