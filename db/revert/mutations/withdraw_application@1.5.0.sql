-- Revert ccbc:mutations/withdraw_application from pg

begin;

drop function ccbc_public.withdraw_application;

commit;
