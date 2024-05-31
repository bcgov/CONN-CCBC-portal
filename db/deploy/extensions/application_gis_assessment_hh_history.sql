-- Deploy ccbc:extensions/application_gis_assessment_hh_history to pg

begin;

select audit.enable_tracking('ccbc_public.application_gis_assessment_hh'::regclass);

commit;
