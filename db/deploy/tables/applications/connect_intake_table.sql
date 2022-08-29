-- Deploy ccbc:tables/applications/connect_intake_table to pg

BEGIN;

ALTER TABLE ccbc_public.application ADD COLUMN intake_id integer;
ALTER TABLE ccbc_public.application ADD CONSTRAINT application_intake_fk
 FOREIGN KEY (intake_id) REFERENCES ccbc_public.intake(id);
ALTER TABLE ccbc_public.application ADD CONSTRAINT unique_intake_and_id UNIQUE(intake_id, ccbc_number);


comment on column ccbc_public.application.intake_id is 'Application Intake Number, used as the prefix for CCBC reference number';

COMMIT;
