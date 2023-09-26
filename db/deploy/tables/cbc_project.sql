-- Deploy ccbc:tables/cbc_project to pg

begin;

create table ccbc_public.cbc_project(
  id integer primary key generated always as identity,
  json_data jsonb not null default '{}'::jsonb,
  sharepoint_timestamp timestamp with time zone default null
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'cbc_project');

-- enable audit/history
select audit.enable_tracking('ccbc_public.cbc_project'::regclass);

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'cbc_project', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'cbc_project', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'cbc_project', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'cbc_project', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'cbc_project', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'cbc_project', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.cbc_project is 'Table containing the data imported from the CBC projects excel file';
comment on column ccbc_public.cbc_project.id is 'Unique ID for the row';
comment on column ccbc_public.cbc_project.json_data is 'The data imported from the excel';
comment on column ccbc_public.cbc_project.sharepoint_timestamp is 'The timestamp of the last time the data was updated from sharepoint';

commit;
