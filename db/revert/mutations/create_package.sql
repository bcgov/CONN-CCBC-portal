-- Revert ccbc:mutations/create_package.sql from pg

begin;

  drop function ccbc_public.create_package;

commit;
