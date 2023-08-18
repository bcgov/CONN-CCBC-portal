-- Revert ccbc:mutations/update_intake from pg

begin;

drop function if exists ccbc_public.update_intake;

commit;
