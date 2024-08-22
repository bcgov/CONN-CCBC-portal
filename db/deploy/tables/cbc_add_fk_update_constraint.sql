-- Deploy ccbc:tables/cbc_add_fk_update_constraint to pg

BEGIN;

ALTER TABLE ccbc_public.cbc_data
DROP CONSTRAINT cbc_data_project_number_fkey;

ALTER TABLE ccbc_public.cbc_data
ADD CONSTRAINT fk_cbc_data
FOREIGN KEY (project_number)
REFERENCES ccbc_public.cbc(project_number)
ON UPDATE CASCADE;

COMMIT;
