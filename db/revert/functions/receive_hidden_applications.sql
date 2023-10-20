-- revert ccbc:functions/receive_hidden_applications from pg

begin;

drop function ccbc_public.receive_hidden_applications;

commit;
