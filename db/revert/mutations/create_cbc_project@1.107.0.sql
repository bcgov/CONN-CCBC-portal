-- Revert ccbc:mutations/create_cbc_project from pg

begin;

drop function if exists ccbc_public.create_cbc_project cascade;

commit;
