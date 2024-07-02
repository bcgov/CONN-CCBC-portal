-- Deploy ccbc:tables/communities_source_data to pg

begin;

create table ccbc_public.communities_source_data(
  id integer primary key generated always as identity,
  geographic_name_id integer not null unique,
  bc_geographic_name varchar(1000) not null,
  geographic_type varchar(1000),
  regional_district varchar(1000),
  economic_region varchar(1000),
  latitude double precision,
  longitude double precision,
  map_link varchar(1000)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'communities_source_data');

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'communities_source_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'communities_source_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'communities_source_data', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'communities_source_data', 'ccbc_analyst');

-- Grant ccbc_service_account permissions
perform ccbc_private.grant_permissions('select', 'communities_source_data', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'communities_source_data', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'communities_source_data', 'cbc_admin');

end
$grant$;

comment on table ccbc_public.communities_source_data is 'Table containing the communities source data imported from CBC projects excel file';
comment on column ccbc_public.communities_source_data.id is 'Unique ID for the row';
comment on column ccbc_public.communities_source_data.geographic_name_id is 'The unique Geographic Name Id';
comment on column ccbc_public.communities_source_data.bc_geographic_name is 'The Geographic Name';
comment on column ccbc_public.communities_source_data.geographic_type is 'The type of the geograhic region';
comment on column ccbc_public.communities_source_data.regional_district is 'The regional district of the geograhic region';
comment on column ccbc_public.communities_source_data.economic_region is 'The economic region of the geograhic region';
comment on column ccbc_public.communities_source_data.latitude is 'The latitude value of the geograhic region';
comment on column ccbc_public.communities_source_data.longitude is 'The longitude value of the geograhic region';
comment on column ccbc_public.communities_source_data.map_link is 'map url of the geograhic region for verification';

commit;
