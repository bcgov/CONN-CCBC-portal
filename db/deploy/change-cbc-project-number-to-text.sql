-- Deploy ccbc:change-cbc-project-number-to-text to pg

BEGIN;

-- 1. Drop foreign key from cbc_data
ALTER TABLE ccbc_public.cbc_data
  DROP CONSTRAINT fk_cbc_data;

-- 2. Drop UNIQUE constraint on cbc.project_number
ALTER TABLE ccbc_public.cbc
  DROP CONSTRAINT cbc_project_number_key;

-- 3. Change column types (using USING to cast integer → text)
ALTER TABLE ccbc_public.cbc
  ALTER COLUMN project_number TYPE text
  USING project_number::text;

ALTER TABLE ccbc_public.cbc_data
  ALTER COLUMN project_number TYPE text
  USING project_number::text;

-- 4. Recreate the UNIQUE constraint on cbc.project_number
ALTER TABLE ccbc_public.cbc
  ADD CONSTRAINT cbc_project_number_key UNIQUE (project_number);

-- 5. Recreate the foreign key with ON UPDATE CASCADE
ALTER TABLE ccbc_public.cbc_data
  ADD CONSTRAINT cbc_data_project_number_fkey
  FOREIGN KEY (project_number)
  REFERENCES ccbc_public.cbc(project_number)
  ON UPDATE CASCADE
  ON DELETE SET NULL;


COMMIT;
