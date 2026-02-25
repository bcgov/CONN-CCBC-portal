-- Revert ccbc:views/cbc_transports_geojson from pg

begin;

drop view if exists ccbc_public.cbc_transports_geojson;

commit;
