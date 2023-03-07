-- Revert ccbc:util_functions/increment_counter from pg

begin;

drop function ccbc_public.increment_counter(regclass, int);

commit;
