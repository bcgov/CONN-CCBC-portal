-- Deploy ccbc:tables/gis_data to pg

begin;

create table ccbc_public.gis_data(
  id integer primary key generated always as identity, 
  json_data jsonb not null default '{}'::jsonb
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'gis_data');

alter table ccbc_public.gis_data force row level security;
alter table ccbc_public.gis_data enable row level security;

grant usage, select on sequence ccbc_public.gis_data_id_seq to ccbc_analyst;
grant usage, select on sequence ccbc_public.gis_data_id_seq to ccbc_admin;

do
$grant$
begin
perform ccbc_private.grant_permissions('select', 'gis_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'gis_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'gis_data', 'ccbc_admin');

perform ccbc_private.grant_permissions('select', 'gis_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'gis_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'gis_data', 'ccbc_analyst');

perform ccbc_private.upsert_policy('ccbc_analyst can always insert', 'gis_data', 'insert', 'ccbc_analyst',
'true');

perform ccbc_private.upsert_policy('ccbc_analyst can always select', 'gis_data', 'select', 'ccbc_analyst',
'true');

perform ccbc_private.upsert_policy('ccbc_analyst can always update', 'gis_data', 'update', 'ccbc_analyst',
'true');

perform ccbc_private.upsert_policy('ccbc_admin can always select', 'gis_data', 'select', 'ccbc_admin',
'true');

perform ccbc_private.upsert_policy('ccbc_admin can always insert', 'gis_data', 'insert', 'ccbc_admin',
'true');

perform ccbc_private.upsert_policy('ccbc_admin can always update', 'gis_data', 'update', 'ccbc_admin',
'true');

end
$grant$;

commit;
