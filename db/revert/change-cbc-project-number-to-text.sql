-- Revert ccbc:change-cbc-project-number-to-text from pg

BEGIN;

-- Drop FK
ALTER TABLE ccbc_public.cbc_data
  DROP CONSTRAINT cbc_data_project_number_fkey;

-- Drop UNIQUE
ALTER TABLE ccbc_public.cbc
  DROP CONSTRAINT cbc_project_number_key;

-- NOTE: This will fail if there are any projects with a project number that is not an integer.
-- Revert types back to integer
-- ALTER TABLE ccbc_public.cbc
--   ALTER COLUMN project_number TYPE integer
--   USING project_number::integer;

-- ALTER TABLE ccbc_public.cbc_data
--   ALTER COLUMN project_number TYPE integer
--   USING project_number::integer;

-- Recreate UNIQUE
ALTER TABLE ccbc_public.cbc
  ADD CONSTRAINT cbc_project_number_key UNIQUE (project_number);

-- Recreate FK
ALTER TABLE ccbc_public.cbc_data
  ADD CONSTRAINT cbc_data_project_number_fkey
  FOREIGN KEY (project_number)
  REFERENCES ccbc_public.cbc(project_number)
  ON UPDATE CASCADE
  ON DELETE SET NULL;



COMMIT;
