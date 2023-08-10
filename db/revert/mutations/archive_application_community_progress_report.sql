-- Revert ccbc:mutations/archive_application_community_progress_report from pg

begin;

drop function if exists ccbc:mutations/archive_application_community_progress_report cascade;

commit;
