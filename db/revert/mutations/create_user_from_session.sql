-- Revert ccbc:mutations/create_user_from_session from pg

begin;

drop function ccbc_public.create_user_from_session;

commit;
