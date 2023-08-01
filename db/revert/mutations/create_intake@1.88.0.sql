-- Revert ccbc:mutations/create_intake from pg

begin;

drop function ccbc_public.create_intake(timestamp with time zone, timestamp with time zone, int);

commit;
