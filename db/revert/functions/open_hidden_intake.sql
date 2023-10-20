-- revert ccbc:functions/open_hidden_intake from pg

begin;

drop function ccbc_public.open_hidden_intake;

commit;
