-- Deploy ccbc:views/applications_view to pg
-- requires: tables/applications

begin;

CREATE OR REPLACE VIEW ccbc_public.applications_view AS SELECT * FROM ccbc_public.applications;

comment on view ccbc_public.applications_view is 'View containing the list of all respondents applications';
comment on column ccbc_public.applications_view.id is 'Primary key ID for the application';
comment on column ccbc_public.applications_view.ccbc_number is 'Reference number assigned to the application';
comment on column ccbc_public.applications_view.owner is 'The owner of the application';
comment on column ccbc_public.applications_view.form_data is 'The data entered into the form by the respondent';
comment on column ccbc_public.applications_view.status is 'The status of the application, draft or complete';
comment on column ccbc_public.applications_view.last_edited_page is 'Column saving the key of the last edited form page';
comment on column ccbc_public.applications_view.created_by is 'created by user id';
comment on column ccbc_public.applications_view.created_at is 'created at timestamp';
comment on column ccbc_public.applications_view.updated_by is 'updated by user id';
comment on column ccbc_public.applications_view.updated_at is 'updated at timestamp';
comment on column ccbc_public.applications_view.archived_by is 'archived by user id';
comment on column ccbc_public.applications_view.archived_at is 'archived at timestamp';
comment on column ccbc_public.applications_view.intake_id is 'Application Intake Number, used as the prefix for CCBC reference number';

commit;
