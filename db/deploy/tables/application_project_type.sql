-- Deploy ccbc:tables/application_project_type to pg

begin;

create table ccbc_public.application_project_type(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  project_type varchar(20) check (project_type in ('lastMile', 'lastMileAndTransport') or project_type is null)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_project_type');

-- enable audit/history
select audit.enable_tracking('ccbc_public.application_project_type'::regclass);

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_project_type', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_project_type', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_project_type', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_project_type', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_project_type', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_project_type', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.application_project_type is 'Table containing the project type of the application';
comment on column ccbc_public.application_project_type.id is 'Unique ID for the application_project_type';
comment on column ccbc_public.application_project_type.application_id is 'ID of the application this application_project_type belongs to';
comment on column ccbc_public.application_project_type.project_type is 'Column containing the project type of the application';

commit;
