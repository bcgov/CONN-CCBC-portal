-- revert ccbc:functions/create_hidden_intake from pg

begin;

drop function ccbc_public.create_hidden_intake;

commit;
