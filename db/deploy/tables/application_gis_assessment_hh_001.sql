-- Deploy ccbc:tables/application_gis_assessment_hh_001 to pg

BEGIN;

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_gis_assessment_hh');

COMMIT;
