-- revert ccbc:computed_columns/application_assessment_form from pg

begin;

drop function ccbc_public.application_assessment_form;

commit;
