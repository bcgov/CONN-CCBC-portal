-- Revert ccbc:mutations/create_change_request from pg

begin;

drop function if exists ccbc_public.create_change_request;

commit;
