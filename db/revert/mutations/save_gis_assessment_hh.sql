-- Revert ccbc:mutations/save_gis_assessment_hh from pg

begin;

drop function if exists ccbc_public.save_gis_assessment_hh;

commit;
