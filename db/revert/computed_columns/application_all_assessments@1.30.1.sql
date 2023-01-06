-- Revert ccbc:computed_columns/application_all_assessments from pg

begin;

drop function ccbc_public.application_all_assessments;

commit;
