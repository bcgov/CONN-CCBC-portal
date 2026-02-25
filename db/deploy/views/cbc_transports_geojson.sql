-- Deploy ccbc:views/cbc_transports_geojson to pg

begin;

create or replace view ccbc_public.cbc_transports_geojson as
select
  gid,
  project__,
  st_asgeojson(geom)::json as geometry
from ccbc_public.cbc_transport;

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'cbc_transports_geojson', 'ccbc_admin');
perform ccbc_private.grant_permissions('select', 'cbc_transports_geojson', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'cbc_transports_geojson', 'cbc_admin');
perform ccbc_private.grant_permissions('select', 'cbc_transports_geojson', 'super_admin');

end
$grant$;

comment on view ccbc_public.cbc_transports_geojson is 'View returning CBC transport geometries as GeoJSON';

commit;
