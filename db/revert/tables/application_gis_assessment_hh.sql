-- Revert ccbc:tables/application_gis_assessment_hh from pg

begin;

drop table ccbc_public.application_gis_assessment_hh cascade;

commit;
