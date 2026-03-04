CREATE OR REPLACE VIEW ccbc_public.cbc_last_mile_coverage_geojson
 AS
 SELECT gid,
    project__,
    st_asgeojson(st_transform(st_setsrid(geom, 3005), 4326))::json AS geometry
   FROM ccbc_public.cbc_last_mile_coverage;

ALTER TABLE ccbc_public.cbc_last_mile_coverage_geojson
    OWNER TO postgres;
COMMENT ON VIEW ccbc_public.cbc_last_mile_coverage_geojson
    IS 'View returning CBC last mile coverage geometries as GeoJSON';

GRANT SELECT ON TABLE ccbc_public.cbc_last_mile_coverage_geojson TO cbc_admin;
GRANT SELECT ON TABLE ccbc_public.cbc_last_mile_coverage_geojson TO ccbc_admin;
GRANT SELECT ON TABLE ccbc_public.cbc_last_mile_coverage_geojson TO ccbc_analyst;
GRANT ALL ON TABLE ccbc_public.cbc_last_mile_coverage_geojson TO postgres;
GRANT SELECT ON TABLE ccbc_public.cbc_last_mile_coverage_geojson TO super_admin;

--

CREATE OR REPLACE VIEW ccbc_public.cbc_transports_geojson
 AS
 SELECT gid,
    project__,
    st_asgeojson(st_transform(st_setsrid(geom, 3005), 4326))::json AS geometry
   FROM ccbc_public.cbc_transport;

ALTER TABLE ccbc_public.cbc_transports_geojson
    OWNER TO postgres;
COMMENT ON VIEW ccbc_public.cbc_transports_geojson
    IS 'View returning CBC transport geometries as GeoJSON';

GRANT SELECT ON TABLE ccbc_public.cbc_transports_geojson TO cbc_admin;
GRANT SELECT ON TABLE ccbc_public.cbc_transports_geojson TO ccbc_admin;
GRANT SELECT ON TABLE ccbc_public.cbc_transports_geojson TO ccbc_analyst;
GRANT ALL ON TABLE ccbc_public.cbc_transports_geojson TO postgres;
GRANT SELECT ON TABLE ccbc_public.cbc_transports_geojson TO super_admin;
