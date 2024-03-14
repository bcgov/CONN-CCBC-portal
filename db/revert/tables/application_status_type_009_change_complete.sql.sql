-- Revert ccbc:tables/application_status_type_009_change_complete.sql from pg

BEGIN;

update ccbc_public.application_status_type set description = 'Complete' where name = 'complete';

COMMIT;
