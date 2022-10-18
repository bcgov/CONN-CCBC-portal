-- Revert ccbc:functions/receive_applications from pg

begin;

drop function ccbc_public.receive_applications;

commit;
