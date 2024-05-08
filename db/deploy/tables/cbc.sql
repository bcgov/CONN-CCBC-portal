-- Deploy ccbc:tables/cbc to pg

begin;

create table ccbc_public.cbc(
  id integer primary key generated always as identity,
  project_number integer not null unique,
  sharepoint_timestamp timestamp with time zone default null
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'cbc');

create index cbc_project_number on ccbc_public.cbc(project_number);

-- enable audit/history
select audit.enable_tracking('ccbc_public.cbc'::regclass);

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'cbc', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'cbc', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'cbc', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'cbc', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'cbc', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'cbc', 'ccbc_analyst');

-- Grant ccbc_service_account permissions
perform ccbc_private.grant_permissions('select', 'cbc', 'ccbc_service_account');
perform ccbc_private.grant_permissions('insert', 'cbc', 'ccbc_service_account');
perform ccbc_private.grant_permissions('update', 'cbc', 'ccbc_service_account');

end
$grant$;

comment on table ccbc_public.cbc is 'Table containing the data imported from the CBC projects excel file, by rows';
comment on column ccbc_public.cbc.id is 'Unique ID for the row';
comment on column ccbc_public.cbc.project_number is 'The project number, unique for each project';
comment on column ccbc_public.cbc.sharepoint_timestamp is 'The timestamp of the last time the data was updated from sharepoint';

commit;
