-- Deploy ccbc:tables/applications/connect_intake_table to pg

BEGIN;

ALTER TABLE ccbc_public.applications ADD COLUMN intake_id integer;
ALTER TABLE ccbc_public.applications ADD CONSTRAINT applications_intake_fk
 FOREIGN KEY (intake_id) REFERENCES ccbc_public.intake(id);
ALTER TABLE ccbc_public.applications ADD CONSTRAINT unique_intake_and_id UNIQUE(intake_id, reference_number);

do
$grant$
begin
    -- Ran into permission issues with trying to update these two fields, not sure why reference number was not included in initial permission grant
    perform ccbc_private.grant_permissions('update', 'applications', 'ccbc_auth_user', ARRAY['intake_id','reference_number']);
end;
$grant$;

comment on column ccbc_public.applications.intake_id is 'Application Intake Number, used as the prefix for CCBC reference number';

COMMIT;
