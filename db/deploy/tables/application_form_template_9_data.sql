-- Deploy ccbc:tables/application_form_template_9_data to pg

begin;

create table ccbc_public.application_form_template_9_data(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  json_data jsonb,
  errors jsonb,
  source jsonb
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_form_template_9_data');

create index application_form_template_9_data_application_id_index on ccbc_public.application_form_template_9_data(application_id);
do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_form_template_9_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_form_template_9_data', 'ccbc_admin');

-- Grant ccbc service account permissions
perform ccbc_private.grant_permissions('select', 'application_form_template_9_data', 'ccbc_service_account');
perform ccbc_private.grant_permissions('insert', 'application_form_template_9_data', 'ccbc_service_account');

end
$grant$;

comment on table ccbc_public.application_form_template_9_data is 'Table containing the Template 9 Data as submitted by the applicant';
comment on column ccbc_public.application_form_template_9_data.id is 'Unique ID for the Template 9 Data';
comment on column ccbc_public.application_form_template_9_data.application_id is 'ID of the application this Template 9 Data belongs to';
comment on column ccbc_public.application_form_template_9_data.json_data is 'The data imported from the Excel filled by the applicant';
comment on column ccbc_public.application_form_template_9_data.errors is 'Errors related to Template 9 for that application id';
comment on column ccbc_public.application_form_template_9_data.source is 'The source of the template 9 data, application or RFI and the date';
commit;
