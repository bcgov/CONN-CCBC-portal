-- revert ccbc:mutations/update_rfi from pg

begin;

drop function ccbc_public.update_rfi;

commit;
