-- Revert ccbc:mutations/archive_application_milestone_data from pg

begin;

drop function if exists ccbc_public.archive_application_milestone_data;

commit;
