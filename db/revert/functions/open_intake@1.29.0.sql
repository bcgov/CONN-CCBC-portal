-- Revert ccbc:functions/open_intake from pg

begin;

drop function ccbc_public.open_intake;

commit;
