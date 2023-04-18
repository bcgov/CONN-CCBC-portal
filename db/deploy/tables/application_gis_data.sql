-- Deploy ccbc:tables/application_gis_data to pg

begin;

create table ccbc_public.application_gis_data(
  id integer primary key generated always as identity,
  batch_id integer references ccbc_public.gis_data(id),
  application_id integer references ccbc_public.application(id),
  json_data jsonb not null default '{}'::jsonb
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_gis_data');

grant usage, select on sequence ccbc_public.application_gis_data_id_seq to ccbc_analyst;
grant usage, select on sequence ccbc_public.application_gis_data_id_seq to ccbc_admin;

do
$grant$
begin
perform ccbc_private.grant_permissions('select', 'application_gis_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_gis_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_gis_data', 'ccbc_admin');

perform ccbc_private.grant_permissions('select', 'application_gis_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_gis_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_gis_data', 'ccbc_analyst');

perform ccbc_private.upsert_policy('ccbc_analyst can always insert', 'application_gis_data', 'insert', 'ccbc_analyst',
'true');

perform ccbc_private.upsert_policy('ccbc_analyst can always select', 'application_gis_data', 'select', 'ccbc_analyst',
'true');

perform ccbc_private.upsert_policy('ccbc_analyst can always update', 'application_gis_data', 'update', 'ccbc_analyst',
'true');

perform ccbc_private.upsert_policy('ccbc_admin can always select', 'application_gis_data', 'select', 'ccbc_admin',
'true');

perform ccbc_private.upsert_policy('ccbc_admin can always insert', 'application_gis_data', 'insert', 'ccbc_admin',
'true');

perform ccbc_private.upsert_policy('ccbc_admin can always update', 'application_gis_data', 'update', 'ccbc_admin',
'true');

end
$grant$;

commit;
