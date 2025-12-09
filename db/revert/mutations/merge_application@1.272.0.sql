-- Revert ccbc:mutations/merge_application from pg

begin;

  drop function ccbc_public.merge_application;

commit;
