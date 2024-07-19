-- Revert ccbc:tables/application_project_type_001_modify_check_constraint from pg

BEGIN;

ALTER TABLE ccbc_public.application_project_type
DROP CONSTRAINT application_project_type_project_type_check;

ALTER TABLE ccbc_public.application_project_type
ADD CONSTRAINT application_project_type_project_type_check
CHECK (project_type IN ('lastMile', 'lastMileAndTransport') OR project_type IS NULL);

COMMIT;
