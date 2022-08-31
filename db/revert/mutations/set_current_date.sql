-- Revert ccbc:mutations/set_current_date from pg

begin;

drop function ccbc_public.set_current_date;

COMMIT;
