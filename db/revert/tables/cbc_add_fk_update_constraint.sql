-- Revert ccbc:tables/cbc_add_fk_update_constraint from pg

BEGIN;

BEGIN;

ALTER TABLE ccbc_public.cbc_data
DROP CONSTRAINT fk_cbc_data;

ALTER TABLE ccbc_public.cbc_data
ADD CONSTRAINT cbc_data_project_number_fkey
FOREIGN KEY (project_number)
REFERENCES ccbc_public.cbc(project_number);

COMMIT;
