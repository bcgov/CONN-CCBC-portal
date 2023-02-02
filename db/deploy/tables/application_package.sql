-- Deploy ccbc:tables/application_package to pg

begin;

create table ccbc_public.application_package(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  package integer not null check (package > 0)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_package');

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_package', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_package', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_package', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_package', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.application_package is 'Table containing the package the application is assigned to';
comment on column ccbc_public.application_package.id is 'Unique ID for the application_package';
comment on column ccbc_public.application_package.application_id is 'ID of the application this application_package belongs to';
comment on column ccbc_public.application_package.application_id is 'Column containing the package number the application is assigned to';

commit;
