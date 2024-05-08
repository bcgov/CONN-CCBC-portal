-- Deploy ccbc:tables/cbc_projects_data to pg

begin;

create table ccbc_public.cbc_projects_data(
  id integer primary key generated always as identity,
  cbc_id integer references ccbc_public.cbc_projects(id),
  project_number integer references ccbc_public.cbc_projects(project_number),
  json_data jsonb not null default '{}'::jsonb,
  sharepoint_timestamp timestamp with time zone default null
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'cbc_projects_data');

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'cbc_projects_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'cbc_projects_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'cbc_projects_data', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'cbc_projects_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'cbc_projects_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'cbc_projects_data', 'ccbc_analyst');

-- Grant ccbc_service_account permissions
perform ccbc_private.grant_permissions('select', 'cbc_project', 'ccbc_service_account');
perform ccbc_private.grant_permissions('insert', 'cbc_project', 'ccbc_service_account');
perform ccbc_private.grant_permissions('update', 'cbc_project', 'ccbc_service_account');

end
$grant$;

comment on table ccbc_public.cbc_projects_data is 'Table containing the json data for cbc applications';
comment on column ccbc_public.cbc_projects_data.id is 'Unique ID for the cbc_projects_data';
comment on column ccbc_public.cbc_projects_data.cbc_id is 'ID of the cbc application this cbc_projects_data belongs to';
comment on column ccbc_public.cbc_projects_data.project_number is 'Column containing the project number the cbc application is from';
comment on column ccbc_public.cbc_project.json_data is 'The data imported from the excel for that cbc project';
comment on column ccbc_public.cbc_project.sharepoint_timestamp is 'The timestamp of the last time the data was updated from sharepoint';

commit;
