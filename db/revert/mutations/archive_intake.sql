-- Revert ccbc:mutations/archive_intake from pg

begin;

drop function if exists ccbc_public.archive_intake;

commit;
