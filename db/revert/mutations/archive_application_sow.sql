-- Revert ccbc:mutations/archive_application_sow from pg

begin;

drop function if exists ccbc_public.archive_application_sow;

commit;
