-- Deploy ccbc:views/cbc_last_mile_coverage_geojson to pg

begin;

create or replace view ccbc_public.cbc_last_mile_coverage_geojson as
select
  gid,
  project__,
  -- Shapefile data is in BC Albers (EPSG:3005); transform to WGS84 (EPSG:4326) for Leaflet
  st_asgeojson(st_transform(st_setsrid(geom, 3005), 4326))::json as geometry
from ccbc_public.cbc_last_mile_coverage;

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'cbc_last_mile_coverage_geojson', 'ccbc_admin');
perform ccbc_private.grant_permissions('select', 'cbc_last_mile_coverage_geojson', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'cbc_last_mile_coverage_geojson', 'cbc_admin');
perform ccbc_private.grant_permissions('select', 'cbc_last_mile_coverage_geojson', 'super_admin');

end
$grant$;

comment on view ccbc_public.cbc_last_mile_coverage_geojson is 'View returning CBC last mile coverage geometries as GeoJSON';

commit;
