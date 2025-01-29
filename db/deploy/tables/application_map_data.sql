-- Deploy ccbc:tables/application_map_data to pg

BEGIN;

create table ccbc_public.application_map_data(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  map_data jsonb,
  files jsonb,
  errors jsonb
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_map_data');

select audit.enable_tracking('ccbc_public.application_map_data'::regclass);

do
$grant$
begin

-- admin
perform ccbc_private.grant_permissions('select', 'application_map_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_map_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_map_data', 'ccbc_admin');

-- analyst
perform ccbc_private.grant_permissions('select', 'application_map_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_map_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_map_data', 'ccbc_analyst');

-- cbc admin
perform ccbc_private.grant_permissions('select', 'application_map_data', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_map_data', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'application_map_data', 'cbc_admin');

-- service account
perform ccbc_private.grant_permissions('select', 'application_map_data', 'ccbc_service_account');
perform ccbc_private.grant_permissions('insert', 'application_map_data', 'ccbc_service_account');
perform ccbc_private.grant_permissions('update', 'application_map_data', 'ccbc_service_account');


end
$grant$;

COMMIT;
