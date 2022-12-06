-- revert ccbc:mutations/create_assessment_form from pg

begin;

drop function ccbc_public.create_assessment_form;

commit;
