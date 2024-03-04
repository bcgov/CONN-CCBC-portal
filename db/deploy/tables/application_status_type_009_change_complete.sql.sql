-- Deploy ccbc:tables/application_status_type_009_change_complete to pg

BEGIN;

update ccbc_public.application_status_type set description = 'Reporting complete' where name = 'complete';

COMMIT;
