-- revert ccbc:computed_columns/application_assessment_form from pg

begin;

drop function if exists ccbc_public.application_assessment_form(ccbc_public.application,character varying);
drop function if exists ccbc_public.application_assessment_form;

commit;
