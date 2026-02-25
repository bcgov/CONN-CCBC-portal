-- Revert ccbc:views/cbc_last_mile_coverage_geojson from pg

begin;

drop view if exists ccbc_public.cbc_last_mile_coverage_geojson;

commit;
