-- Deploy ccbc:views/cbc_last_mile_coverage_geojson to pg

begin;

create or replace view ccbc_public.cbc_last_mile_coverage_geojson as
select
  gid,
  project__,
  st_asgeojson(geom)::json as geometry
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
