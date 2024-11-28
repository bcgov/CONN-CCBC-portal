-- Deploy ccbc:tables/application_dependencies to pg

BEGIN;

create table ccbc_public.application_dependencies(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  json_data jsonb not null default '{}'::jsonb,
  reason_for_change varchar(100)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_dependencies');

-- enable audit/history
select audit.enable_tracking('ccbc_public.application_dependencies'::regclass);

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_dependencies', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_dependencies', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_dependencies', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_dependencies', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_dependencies', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_dependencies', 'ccbc_analyst');

-- Grant cbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_dependencies', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_dependencies', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'application_dependencies', 'cbc_admin');

end
$grant$;

comment on table ccbc_public.application_dependencies is 'Table containing the data about the project dependencies';
comment on column ccbc_public.application_dependencies.id is 'Unique ID for the row';
comment on column ccbc_public.application_dependencies.application_id is 'The ID of the application';
comment on column ccbc_public.application_dependencies.json_data is 'The data about the dependencies CRTC and/or Connected Coast dependent';
comment on column ccbc_public.application_dependencies.reason_for_change is 'The reason for the change';

COMMIT;
