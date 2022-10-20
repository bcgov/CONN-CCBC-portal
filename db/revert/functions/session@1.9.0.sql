-- Revert ccbc:function/session from pg

begin;

drop function ccbc_public.session;

commit;
